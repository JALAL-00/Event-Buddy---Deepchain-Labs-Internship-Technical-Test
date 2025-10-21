import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your_default_secret',
    });
  }

  // This method is called by Passport after it has successfully validated the token signature.
  // The 'payload' is the decrypted content of the JWT.
  async validate(payload: { sub: string; email: string; role: string }) {
    // We can use the user ID from the token payload to fetch the full user object.
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    // Passport will attach this return value to the request object as `request.user`.
    // So, in our controllers, we can access the logged-in user with `@Req() req`.
    return { id: user.id, email: user.email, role: user.role };
  }
}
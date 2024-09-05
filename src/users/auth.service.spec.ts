import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { TestingModule, Test } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const fakeusersSerivce: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    // This create a DI Container
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeusersSerivce },
      ],
    }).compile();

    // This will cause our DI container to create a new instance
    // of our authService with all of its different dependencies already
    // initialized
    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // This will make sure we successfully created the service
    // and it's defined in some way in our test
    expect(service).toBeDefined();
  });
});

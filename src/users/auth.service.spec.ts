import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { TestingModule, Test } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        // find is async so we're supposed to return a promise that will resolve to a list of users
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    // This create an isolated DI Container when testing
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
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

  it('creates a new user with a salted and hashed password', async () => {
    const email = 'test@test.com';
    const password = 'asdf';

    const user = await service.signup(email, password);

    expect(user.password).not.toEqual(password);
    // expect it to fail by passing in a wrong split separator
    // const [salt, hash] = user.password.split('$');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');

    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});

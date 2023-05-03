const { hash, verify } = require('argon2');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');
const { rule } = require('graphql-shield');

class AuthService  {

  constructor() {
      this.user = null;
  }

  async register(name, email, password) {
    this.user = await userService.findUserByEmail(email);
    if (this.user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    this.user = await userService.createUser({
      name,
      email,
      password: hashedPassword
    });

    return {
      user: this.user,
      access_token: this.signJwt({ id: this.user.id }),
    };
  }

  async login(email, password) {
    this.user = await userService.findUserByEmail(email);
    if (!this.user) {
      throw new Error('User or password incorrect');
    }
    
    const isValid = await this.verifyPassword(password, this.user.password);
  
    if (!isValid) {
      throw new Error('User or password incorrect');
    }

    console.log(this.user);

    return {
      user: {
        id: this.user._id,
        email: this.user.email,
      },
      access_token: this.signJwt({
        id: this.user._id,
        email: this.user.email
      }),
    };
  }

  async updatePassword(id, password) {
    password =  await this.hashPassword(password);
    return userService.updateUser(id, { password });
  }

  logout() {
      this.user = null;
  }
  isLoggedIn() {
      return !!this.user;
  }

  async hashPassword(password) {
    return await hash(password);
  }

  async verifyPassword(password, hash) {
    return await verify(hash, password);
  }

  signJwt(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

}

const isAuthenticated = rule()((parent, args, context) => {
  return context.user === 1;
})

module.exports = {
  authService: new AuthService(),
  isAuthenticated
}
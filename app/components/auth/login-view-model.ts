import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
  private authService: AuthService;
  private _email: string = '';
  private _password: string = '';

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (this._email !== value) {
      this._email = value;
      this.notifyPropertyChange('email', value);
    }
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    if (this._password !== value) {
      this._password = value;
      this.notifyPropertyChange('password', value);
    }
  }

  async onLogin() {
    try {
      await this.authService.login(this._email, this._password);
      Frame.topmost().navigate({
        moduleName: 'components/home/home-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Erro no login:', error);
      // TODO: Mostrar mensagem de erro
    }
  }

  onRegister() {
    Frame.topmost().navigate({
      moduleName: 'components/auth/register-view'
    });
  }
}
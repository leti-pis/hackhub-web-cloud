import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

}

import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth} from '../services/auth';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
 
  username: string = '';
  password: string = '';
  checked:boolean=true;
  navigation = inject(Router);
  route = inject(ActivatedRoute);
  errorMessage: string = '';
  changeDetector = inject(ChangeDetectorRef);
  constructor(private auth: Auth) {}
  ngOnChange(){
    console.log('ngOnChange')
  } 
  ngOnInit(){
    console.log('ngOnInit')
  } 
  ngDoCheck(){
    console.log('ngDoCheck')
  } 
  ngAfterContentInit(){
    console.log('ngAfterContentInit')
  } 
  ngAfterContentChecked(){
    console.log('ngAfterContentChecked')
  } 
  ngAfterViewInit(){
    console.log('ngAfterViewInit')
  } 
  ngAfterViewChecked(){
    console.log('ngAfterViewChecked')
  } 
  ngOnDestory(){
    console.log('ngOnDestory')
  }
  doLogin() {
    // Clear any previous error message
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        // Handle successful login, e.g., navigate to the dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.navigation.navigateByUrl(returnUrl);
      },
      error: (error) => {
        // Handle login error, e.g., display an error message
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
}

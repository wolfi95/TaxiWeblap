using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.Exceptions;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;
using TaxiService.Web.Helpers;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IConfiguration configuration;
        private readonly IReservationService reservationService;
        private readonly IUserService userService;
        private readonly IEmailService emailService;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, IReservationService reservationService, IUserService userService, IEmailService emailService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.reservationService = reservationService;
            this.userService = userService;
            this.emailService = emailService;
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDataResponse>> Login([FromBody] UserLoginDto loginData)
        {
            if (String.IsNullOrEmpty(loginData.Email) || String.IsNullOrEmpty(loginData.Password))
            {
                throw new BuisnessLogicException("Email and password cannot be empty");
            }
            var user = await userManager.FindByEmailAsync(loginData.Email);
            if (user == null)
            {
                throw new BuisnessLogicException("Cannot find user");
            }

            var result = await signInManager.PasswordSignInAsync(user, loginData.Password, false, false);
            if (result.Succeeded)
            {
                emailService.SendMail(loginData.Email, "login", "You just logged in!");
                var token = AuthenticationHelper.GenerateJwtToken(user, configuration);
                var res = new UserDataResponse
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Token = token,
                    Name = user.UserName,
                    Address = user.Address,
                    Role = user.Role
                };
                return new OkObjectResult(res);
            }
            else
            {
                throw new BuisnessLogicException("Wrong password");
            }
        }
        
        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerData)
        {
            if (String.IsNullOrEmpty(registerData.Email) ||
                String.IsNullOrEmpty(registerData.Password) ||
                String.IsNullOrEmpty(registerData.EmailRe) ||
                String.IsNullOrEmpty(registerData.PasswordRe))
            {
                throw new BuisnessLogicException("Email and password cannot be empty.");
            }

            if (String.IsNullOrEmpty(registerData.Name))
            {
                throw new BuisnessLogicException("Name cannot be empty.");
            }

            if(registerData.Email != registerData.EmailRe)
            {
                throw new BuisnessLogicException("Email and confirmation doesnt match.");
            }
            if(registerData.Password != registerData.PasswordRe)
            {
                throw new BuisnessLogicException("Password and confirmation doesnt match.");
            }

            if((await userManager.FindByEmailAsync(registerData.Email)) != null)
            {
                throw new BuisnessLogicException("Email already in use.");
            }

            var newUser = new ApplicationClient
            {
                Email = registerData.Email,
                TwoFactorEnabled = false,
                UserName = registerData.Email,
                AllowNews = registerData.AllowSpam,
                Role = UserRoles.User,
                Name = registerData.Name,
                Phone = registerData.Phone
            };

            var result = await userManager.CreateAsync(newUser, registerData.Password);            

            if (!result.Succeeded)
            {
                var msg = "";
                foreach(var err in result.Errors)
                {
                    msg += err.Description + Environment.NewLine;
                }
                throw new ArgumentException(msg);
            }
            await userManager.AddToRoleAsync(newUser, UserRoles.User);

            return new OkResult();
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Administrator)]
        public async Task<PagedData<UserDetailDto>> SearchUsers([FromBody] SearchUserDto searchData)
        {
            return await userService.SearchUsers(searchData);
        }

        [HttpGet]
        [Route("reservations")]
        public async Task<List<ReservationDetailDto>> GetUserReservations()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                if(!(await userManager.IsInRoleAsync(user, UserRoles.Administrator)))
                {
                    throw new ArgumentException("Unauthorized access attempt.");
                }
            }

            return await reservationService.GetUserReservations(user.Id);
        }  
        
        [HttpPost]
        [Route("changePassword")]
        public async Task ChangePassword([FromBody] ResetPassDto resetPassDto)
        {
            var user = await userManager.GetUserAsync(User);

            if(user == null)
            {
                throw new ArgumentException("Cannot find user");
            }

            if (String.IsNullOrEmpty(resetPassDto.OldPassword) || String.IsNullOrEmpty(resetPassDto.NewPassword) || String.IsNullOrEmpty(resetPassDto.NewPasswordConfirm))
            {
                throw new BuisnessLogicException("Fields cannot be empty.");
            }
            if (!(await userManager.CheckPasswordAsync(user, resetPassDto.OldPassword)))
            {
                throw new BuisnessLogicException("Wrong old password.");
            }
            if(resetPassDto.NewPassword != resetPassDto.NewPasswordConfirm)
            {
                throw new BuisnessLogicException("New password and its confirmation must match!");
            }

            await userManager.ChangePasswordAsync(user, resetPassDto.OldPassword, resetPassDto.NewPassword);
        }

        [HttpPost]
        [Route("changeData")]
        public async Task ChangePersonalData(ChangePersonalDataDto personalDataDto)
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            await userService.ChangePersonalData(personalDataDto, user.Id);
        }

        [HttpGet]
        public async Task<UserDetailDto> GetUserData()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            return await userService.GetUserDetail(user.Id);
        }

        [HttpPost]
        [Route("emailNotifications")]
        public async Task ChangeEmailNotificationsSetting()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            await userService.ChangeEmailNotificationSetting(user.Id);
        }

        [HttpGet]
        [Route("settings")]
        public async Task<UserSettingsDto> GetUserSettings()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            return await userService.GetUserSettings(user.Id);
        }

        [HttpDelete]
        public async Task DeleteAccount()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }
            await userService.DeleteAccount(user);            
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("all")]
        public async Task<List<User>> GetAllUsers()
        {
            return await userService.GetAllUsers();
        }

        [HttpPost("contact")]
        public async Task<IActionResult> ContactUs([FromBody] ContactUsDto contactUsDto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            emailService.SendMail(Environment.GetEnvironmentVariable("BOOKING_EMAIL") ?? configuration["EmailService:User"], "Contact - " + contactUsDto.Reason, contactUsDto.Message + "\nFrom: " + user.Email);
            emailService.SendMail(user.Email, "Taxi service contact", "You have reached out to us with the following message:\n" + contactUsDto.Message);

            return Ok();
        }
    }
}

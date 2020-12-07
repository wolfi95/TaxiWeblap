using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;
using TaxiService.Web.Helpers;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly RoleManager<User> roleManager;
        private readonly IConfiguration configuration;
        private readonly IReservationService reservationService;
        private readonly IUserService userService;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<User> roleManager, IConfiguration configuration, IReservationService reservationService, IUserService userService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.configuration = configuration;
            this.reservationService = reservationService;
            this.userService = userService;
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDataResponse>> Login([FromBody] UserLoginDto loginData)
        {
            if (loginData.Email == null || loginData.Password == null)
            {
                return new UnauthorizedObjectResult("Email and password cannot be empty");
            }
            var user = await userManager.FindByEmailAsync(loginData.Email);
            if (user == null)
            {
                return new UnauthorizedObjectResult("Cannot find user");
            }

            var result = await signInManager.PasswordSignInAsync(loginData.Email, loginData.Password, false, false);
            if (result.Succeeded)
            {
                var token = AuthenticationHelper.GenerateJwtToken(user, configuration);
                var res = new UserDataResponse
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Token = token,
                };
                return new OkObjectResult(res);
            }
            else
            {
                return new UnauthorizedObjectResult("Wrong password");
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
                return new UnauthorizedObjectResult("Email and password cannot be empty.");
            }

            if (String.IsNullOrEmpty(registerData.Name))
            {
                return new UnauthorizedObjectResult("Name cannot be empty.");
            }

            if(registerData.Email != registerData.EmailRe)
            {
                return new BadRequestObjectResult("Email and confirmation doesnt match.");
            }
            if(registerData.Password != registerData.PasswordRe)
            {
                return new BadRequestObjectResult("Password and confirmation doesnt match.");
            }

            if((await userManager.FindByEmailAsync(registerData.Email)) != null)
            {
                return new BadRequestObjectResult("Email already in use.");
            }

            var newUser = new User
            {
                Email = registerData.Email,
                TwoFactorEnabled = false,
                UserName = registerData.Name,
            };

            var result = await userManager.CreateAsync(newUser, registerData.Password);            

            if (!result.Succeeded)
            {
                var msg = "";
                foreach(var err in result.Errors)
                {
                    msg += err.Description + Environment.NewLine;
                }
                return new BadRequestObjectResult(msg);
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
        [Route("{id}/reservations")]
        public async Task<List<ReservationDetailDto>> GetUserReservations([FromRoute] string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            var user = await userManager.GetUserAsync(User);
            if (user.Id != id)
            {
                if(!(await userManager.IsInRoleAsync(user, UserRoles.Administrator)))
                {
                    throw new ArgumentException("Unauthorized access attempt.");
                }
            }

            return await reservationService.GetUserReservations(id);
        }  
        
        [HttpPost]
        [Route("{id}/changePassword")]
        public async Task ChangePassword([FromRoute] string id, ResetPassDto resetPassDto)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            if ((await userManager.GetUserAsync(User)).Id != id)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }
            if (String.IsNullOrEmpty(resetPassDto.OldPassword) || String.IsNullOrEmpty(resetPassDto.NewPassword) || String.IsNullOrEmpty(resetPassDto.NewPasswordConfirm))
            {
                throw new ArgumentNullException("Fields cannot be empty.");
            }
            var user = await userManager.GetUserAsync(User);
            if (!(await userManager.CheckPasswordAsync(user, resetPassDto.OldPassword)))
            {
                throw new ArgumentException("Wrong old password.");
            }
            if(resetPassDto.NewPassword != resetPassDto.NewPasswordConfirm)
            {
                throw new ArgumentException("New password and its confirmation must match!");
            }

            await userManager.ChangePasswordAsync(user, resetPassDto.OldPassword, resetPassDto.NewPassword);
        }

        [HttpPost]
        [Route("{id}/changeData")]
        public async Task ChangePersonalData([FromRoute] string id, ChangePersonalDataDto personalDataDto)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            if ((await userManager.GetUserAsync(User)).Id != id)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            await userService.ChangePersonalData(personalDataDto, userManager.GetUserId(User));
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<UserDetailDto> GetUserData([FromRoute] string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            if ((await userManager.GetUserAsync(User)).Id != id)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            return await userService.GetUserDetail(id);
        }

        [HttpPost]
        [Route("{id}/emailNotifications")]
        public async Task ChangeEmailNotificationsSetting([FromRoute] string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            if ((await userManager.GetUserAsync(User)).Id != id)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }

            await userService.ChangeEmailNotificationSetting(id);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeleteAccount([FromRoute] string id)
        {
            if (String.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("User identifier cannot be empty");
            }
            if ((await userManager.GetUserAsync(User)).Id != id)
            {
                throw new ArgumentException("Unauthorized access attempt.");
            }
           
            await userManager.DeleteAsync(await userManager.GetUserAsync(User));
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.Services
{
    public class UserService : IUserService
    {
        private readonly TaxiServiceContext context;
        private readonly UserManager<User> userManager;

        public UserService(TaxiServiceContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        public async Task ChangeEmailNotificationSetting(string id)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
            var userAsClient = user as ApplicationClient;

            if(userAsClient == null)
            {
                throw new ArgumentException("Cannot find User");
            }
            userAsClient.AllowNews = !userAsClient.AllowNews;
            await context.SaveChangesAsync();
        }

        public async Task ChangePersonalData(ChangePersonalDataDto personalDataDto, string userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                throw new ArgumentException("Cannot find User");
            }
            user.UserName = personalDataDto.Name;
            user.NormalizedUserName = personalDataDto.Name.ToUpper().Trim();
            user.Email = personalDataDto.Email;
            user.NormalizedEmail = personalDataDto.Email.ToUpper().Trim();
            user.Address = personalDataDto.Address;

            await context.SaveChangesAsync();
        }

        public async Task DeleteAccount(User user)
        {
            using (var transation = context.Database.BeginTransaction())
            {
                if (context.Reservations.Where(x => x.Client== user).Any(x => x.Date < DateTime.Now)) {
                    throw new ArgumentException("Cannot delete account while there are active reservations. Please cancel any active reservations or contact support.");
                }

                var reservations = await context.Reservations.Include(x => x.Preferences).Where(x => x.Client == user).ToListAsync();
                context.ReservationPreferences.RemoveRange(reservations.SelectMany(x => x.Preferences));
                context.Reservations.RemoveRange(reservations);

                await userManager.DeleteAsync(user);

                await context.SaveChangesAsync();

                await transation.CommitAsync();
            }
        }

        public async Task<UserDetailDto> GetUserDetail(string id)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                throw new ArgumentException("Cannot find User");
            }

            return new UserDetailDto
            {
                Id = user.Id,
                Address = user.Address,
                Email = user.Email,
                Name = user.UserName
            };
        }

        public async Task<UserSettingsDto> GetUserSettings(string id)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);

            var userAsClient = user as ApplicationClient;

            if (userAsClient == null)
            {
                throw new ArgumentException("Cannot find User");
            }

            return new UserSettingsDto
            {
                AllowEmails = userAsClient.AllowNews
            };
        }

        public async Task<PagedData<UserDetailDto>> SearchUsers(SearchUserDto searchData)
        {
            var usersQuery = context.Users.AsQueryable();

            if (!String.IsNullOrEmpty(searchData.UserName))
            {
                usersQuery = usersQuery.Where(x => x.UserName.Contains(searchData.UserName));
            }

            if (!String.IsNullOrEmpty(searchData.UserAddress))
            {
                usersQuery = usersQuery.Where(x => x.Address.Contains(searchData.UserAddress));
            }

            var resultCount = await usersQuery.CountAsync();

            var pageCount =  Math.Ceiling((double)(resultCount / searchData.PageSize));

            return new PagedData<UserDetailDto> { Data = await usersQuery.Select(x => new UserDetailDto { Id = x.Id, Address = x.Address, Email = x.Email, Name = x.UserName }).ToListAsync(), ResultCount = (int)pageCount };
        }

        public async Task<List<User>> GetAllUsers()
        {
            return  await context.Users.ToListAsync();
        }
    }
}
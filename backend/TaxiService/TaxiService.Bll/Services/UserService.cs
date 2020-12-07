using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.Services
{
    public class UserService : IUserService
    {
        private readonly TaxiServiceContext context;

        public UserService(TaxiServiceContext context)
        {
            this.context = context;
        }

        public async Task ChangeEmailNotificationSetting(string id)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);    

            if(user == null)
            {
                throw new ArgumentException("Cannot find User");
            }
            user.AllowNews = !user.AllowNews;
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

        public Task<UserDetailDto> GetUserDetail(string id)
        {
            throw new NotImplementedException();
        }

        public Task<PagedData<UserDetailDto>> SearchUsers(SearchUserDto searchData)
        {
            throw new NotImplementedException();
        }
    }
}
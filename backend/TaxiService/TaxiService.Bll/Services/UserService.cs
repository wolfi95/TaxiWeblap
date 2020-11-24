using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.Services
{
    public class UserService : IUserService
    {
        public Task ChangeEmailNotificationSetting(string id)
        {
            throw new NotImplementedException();
        }

        public Task ChangePersonalData(ChangePersonalDataDto personalDataDto)
        {
            throw new NotImplementedException();
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
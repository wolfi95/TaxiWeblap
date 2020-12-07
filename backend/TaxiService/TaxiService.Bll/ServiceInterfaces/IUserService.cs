using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Dto.User;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IUserService
    {
        public Task ChangePersonalData(ChangePersonalDataDto personalDataDto, string userId);
        public Task<UserDetailDto> GetUserDetail(string id);
        public Task ChangeEmailNotificationSetting(string id);
        public Task<PagedData<UserDetailDto>> SearchUsers(SearchUserDto searchData);
    }
}

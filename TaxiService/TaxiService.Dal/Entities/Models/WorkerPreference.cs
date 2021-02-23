using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Dal.Entities.Models
{
    public class WorkerPreference
    {
        public Guid Id { get; set; }
        public Worker  Worker { get; set; }
        public string WorkerId { get; set; }
        public Preference Preference { get; set; }
        public int PreferenceId { get; set; }
    }
}

using Microsoft.AspNetCore.Http; 
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Text;
using System.Security.Cryptography; 
using Npgsql; 
namespace Test02.Server.Controllers 
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase 
    { 
        private readonly NpgsqlConnection _connection;
        public UserController(NpgsqlConnection connection) => _connection = connection; 
        
        // ---- DTO ----
        public class UserRequest 
        { 
            public string EmployeeNo { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty; 
            public string NameKana { get; set; } = string.Empty; 
            public string TelNo { get; set; } = string.Empty; 
            public string MailAddress { get; set; } = string.Empty;
            public string Position { get; set; } = string.Empty; 
            public string AccountLevel { get; set; } = string.Empty;
            public DateTime UpdateDate { get; set; }

            //詳細情報
            public string? Department { get; set; } 
            public int? Age { get; set; } 
            public int? Gender { get; set; }
            public DateTime? RetireDate { get; set; }
            public DateTime? RegisterDate { get; set; } 
            public bool DeleteFlag { get; set; }
        } 
        // ---- /user/list : ユーザー情報取得 ----
        [HttpGet("list")] 
        public async Task<IActionResult> List() 
        {
            try { 
                if (_connection.State != ConnectionState.Open)
                    await _connection.OpenAsync(); 
                
                const string sql = @"
                            SELECT employee_no, name, name_kana, tel_no,
                                   mail_address, position, account_level, 
                                   update_date, department,age,gender,
                                   retire_date,register_date,delete_flag 
                            FROM mst_user 
                            order by employee_no"; 
                using var cmd = new NpgsqlCommand(sql, _connection); 
                using var reader = await cmd.ExecuteReaderAsync(); 
                var list = new List<UserRequest>(); 
                while (await reader.ReadAsync())
                {
                    list.Add(new UserRequest 
                    { 
                        EmployeeNo = reader["employee_no"]?.ToString() ?? "",
                        Name = reader["name"]?.ToString() ?? "",
                        NameKana = reader["name_kana"]?.ToString() ?? "", 
                        TelNo = reader["tel_no"]?.ToString() ?? "", 
                        MailAddress = reader["mail_address"]?.ToString() ?? "",
                        Position = reader["position"]?.ToString() ?? "", 
                        AccountLevel = reader["account_level"]?.ToString() ?? "", 
                        UpdateDate = reader.GetFieldValue<DateTime>(reader.GetOrdinal("update_date")), 
                        Department = reader["department"] as string,
                        Age = reader.IsDBNull(reader.GetOrdinal("age")) ? null : reader.GetInt32(reader.GetOrdinal("age")),
                        Gender = reader.IsDBNull(reader.GetOrdinal("gender")) ? null : reader.GetInt32(reader.GetOrdinal("gender")),
                        RetireDate = reader.IsDBNull(reader.GetOrdinal("retire_date")) ? null : reader.GetDateTime(reader.GetOrdinal("retire_date")),
                        RegisterDate = reader.IsDBNull(reader.GetOrdinal("register_date")) ? null : reader.GetDateTime(reader.GetOrdinal("register_date")),

                        DeleteFlag = !reader.IsDBNull(reader.GetOrdinal("delete_flag")) && reader.GetBoolean(reader.GetOrdinal("delete_flag"))
                        });
                }

                return Ok(list); 
            } finally { 
                if (_connection.State == ConnectionState.Open) await _connection.CloseAsync();
            } 
        }
    } 
}
//using Microsoft.AspNetCore.Mvc;
//using Npgsql;
//using System.Data;

//namespace Test02.Server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class UserController : ControllerBase
//    {
//        private readonly NpgsqlConnection _connection;
//        public UserController(NpgsqlConnection connection) => _connection = connection;

//        // /api/user/list
//        [HttpGet("list")]
//        public async Task<IActionResult> GetUsers()
//        {
//            try
//            {
//                if (_connection.State != ConnectionState.Open)
//                    await _connection.OpenAsync();

//                const string sql = @"
//                    SELECT employee_no, name, name_kana, tel_no, mail_address, position, account_level, updated_date,
//                           department, age, gender, retire_date, register_date, delete_flag
//                      FROM mst_user
//                     WHERE delete_flag = FALSE
//                     ORDER BY employee_no";

//                using var cmd = new NpgsqlCommand(sql, _connection);
//                using var reader = await cmd.ExecuteReaderAsync();

//                var users = new List<object>();
//                while (await reader.ReadAsync())
//                {
//                    users.Add(new
//                    {
//                        employeeNo = reader["employee_no"]?.ToString(),
//                        name = reader["name"]?.ToString(),
//                        nameKana = reader["name_kana"]?.ToString(),
//                        telNo = reader["tel_no"]?.ToString(),
//                        mailAddress = reader["mail_address"]?.ToString(),
//                        position = reader["position"]?.ToString(),
//                        accountLevel = reader["account_level"]?.ToString(),
//                        updatedDate = reader["updated_date"],
//                        department = reader["department"]?.ToString(),
//                        age = reader["age"],
//                        gender = reader["gender"]?.ToString(),
//                        retireDate = reader["retire_date"] as DateTime?,
//                        registerDate = reader["register_date"],
//                        deletedFlag = (bool)reader["delete_flag"]
//                    });
//                }

//                return Ok(users);
//            }
//            finally
//            {
//                if (_connection.State == ConnectionState.Open)
//                    await _connection.CloseAsync();
//            }
//        }
//    }
//}

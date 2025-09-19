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
                            WHERE delete_flag = false
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

        // ---- /user/register : ユーザー登録 ----
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRequest user)
        {
            if (user == null) return BadRequest("ユーザー情報が空です");

            try
            {
                if (_connection.State != ConnectionState.Open)
                    await _connection.OpenAsync();

                const string sql = @"
            INSERT INTO mst_user (
                employee_no, name, name_kana, tel_no, mail_address,
                position, account_level, update_date,
                department, age, gender, retire_date, register_date, delete_flag
            ) VALUES (
                @employee_no, @name, @name_kana, @tel_no, @mail_address,
                @position, @account_level, @update_date,
                @department, @age, @gender, @retire_date, @register_date, @delete_flag
            );";

                using var cmd = new NpgsqlCommand(sql, _connection);
                cmd.Parameters.AddWithValue("@employee_no", user.EmployeeNo);
                cmd.Parameters.AddWithValue("@name", user.Name);
                cmd.Parameters.AddWithValue("@update_date", DateTime.Now);

                // null を許容するカラム
                cmd.Parameters.AddWithValue("@name_kana", (object?)user.NameKana ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@tel_no", (object?)user.TelNo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@mail_address", (object?)user.MailAddress ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@position", (object?)user.Position ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@account_level", (object?)user.AccountLevel ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@department", (object?)user.Department ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@age", (object?)user.Age ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@gender", (object?)user.Gender ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@retire_date", (object?)user.RetireDate ?? DBNull.Value);

                // 登録日は必ず入れる
                cmd.Parameters.AddWithValue("@register_date", DateTime.Now);

                // 論理削除フラグはデフォルト false
                cmd.Parameters.AddWithValue("@delete_flag", false);


                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "ユーザー登録が完了しました" });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        // ---- /user/delete : ユーザー削除 ----
        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] UserRequest user)
        {
            if (string.IsNullOrEmpty(user.EmployeeNo))
                return BadRequest("社員番号が指定されていません");

            try
            {
                if (_connection.State != ConnectionState.Open)
                    await _connection.OpenAsync();

                const string sql = @"
            UPDATE mst_user
            SET delete_flag = true, update_date = @update_date
            WHERE employee_no = @employee_no;";

                using var cmd = new NpgsqlCommand(sql, _connection);
                cmd.Parameters.AddWithValue("@employee_no", user.EmployeeNo);
                cmd.Parameters.AddWithValue("@update_date", DateTime.Now);

                var rows = await cmd.ExecuteNonQueryAsync();

                if (rows == 0)
                    return NotFound(new { message = "該当するユーザーが見つかりません" });

                return Ok(new { message = "ユーザーを削除しました" });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] UserRequest user)
        {
            if (string.IsNullOrEmpty(user.EmployeeNo))
                return BadRequest("社員番号が指定されていません");

            try
            {
                if (_connection.State != ConnectionState.Open)
                    await _connection.OpenAsync();

                const string sql = @"
            UPDATE mst_user
            SET name = @name,
                name_kana = @name_kana,
                tel_no = @tel_no,
                mail_address = @mail_address,
                position = @position,
                account_level = @account_level,
                department = @department,
                age = @age,
                gender = @gender,
                retire_date = @retire_date,
                update_date = @update_date
            WHERE employee_no = @employee_no;";

                using var cmd = new NpgsqlCommand(sql, _connection);
                cmd.Parameters.AddWithValue("@employee_no", user.EmployeeNo);
                cmd.Parameters.AddWithValue("@name", user.Name);
                cmd.Parameters.AddWithValue("@name_kana", (object?)user.NameKana ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@tel_no", (object?)user.TelNo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@mail_address", (object?)user.MailAddress ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@position", (object?)user.Position ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@account_level", (object?)user.AccountLevel ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@department", (object?)user.Department ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@age", (object?)user.Age ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@gender", (object?)user.Gender ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@retire_date",(object?)user.RetireDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@update_date", DateTime.Now);

                var rows = await cmd.ExecuteNonQueryAsync();
                if (rows == 0)
                    return NotFound(new { message = "対象ユーザーが見つかりません" });

                return Ok(new { message = "ユーザー情報を更新しました" });
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }


    }
}
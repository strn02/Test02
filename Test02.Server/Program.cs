using Npgsql;
using System.Text.Json;
using System.Text.Encodings.Web;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        //日本語（UTF-8）を正しく処理するための設定
        options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

//PostgreSQLに接続(本番はappsettings.jsonから)
string connString = "Host=localhost;Username=postgres;Password=20020802;Database=test;";
builder.Services.AddScoped<NpgsqlConnection>(_ => new NpgsqlConnection(connString));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}


app.Run();




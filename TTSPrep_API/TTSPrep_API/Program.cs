using Microsoft.EntityFrameworkCore;
using TTSPrep_API.Data;
using TTSPrep_API.Repository.IRepository;
using TTSPrep_API.Repository;
using Microsoft.AspNetCore.Identity;
using TTSPrep_API.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using TTSPrep_API.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); // Many to many relationships will go into the entity and get stuck in a loop
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); // AutoMapper 
builder.Services.AddEndpointsApiExplorer(); // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});



#region Jwt Token Authentification
builder.Services.Configure<AppSettings_Jwt>(builder.Configuration.GetSection(key: "JwtConfig"));

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value));
var tokenValidationParams = new TokenValidationParameters()
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = key,
    ValidateIssuer = false, // Set to false for development: running the app locally on device might cause the generated https ssl credentials to become invalidated, causing an issue
    //ValidIssuer = ,
    ValidateAudience = false, // for dev
    RequireExpirationTime = false, // for dev -- needs to be updated when refresh token is added
    ValidateLifetime = true, // Calculates how long the token will be valid
};

builder.Services.AddSingleton(tokenValidationParams);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(jwt =>
    {
        jwt.SaveToken = true;
        jwt.TokenValidationParameters = tokenValidationParams;
    });
#endregion


builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServer_Connection"));
    //options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL_Connection"));
    //options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL_Docker_localhost_Connection"));
    //options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL_Docker_Connection"));
    //options.UseSqlite(builder.Configuration.GetConnectionString("SQLite_Connection"));
    //options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL_Supabase_Connection"));
    //options.UseSqlServer(builder.Configuration.GetConnectionString("ProdConnection"));
});

builder.Services.AddIdentity<AppUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<AppDbContext>();

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            name: myAllowSpecificOrigins,
            policy =>
            {
                policy.WithOrigins("http://localhost:4200") // Include client app's origin
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                policy.WithOrigins("https://ttsprepclientlocalhost.azurewebsites.net")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    }
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

SeedDatabase();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


async void SeedDatabase()
{
    using (var scope = app.Services.CreateScope())
    {
        var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
        await dbInitializer.Initialize();
    }
}
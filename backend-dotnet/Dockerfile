# Stage 1: Build & Publish all ASP.NET Core .NET 9 Microservices
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview as builder

WORKDIR /src

COPY src/TalentOS.Shared/TalentOS.Shared.csproj src/TalentOS.Shared/
COPY src/TalentOS.Gateway/TalentOS.Gateway.csproj src/TalentOS.Gateway/
COPY src/TalentOS.IdentityService/TalentOS.IdentityService.csproj src/TalentOS.IdentityService/
COPY src/TalentOS.EmployeeService/TalentOS.EmployeeService.csproj src/TalentOS.EmployeeService/
COPY src/TalentOS.RecruitmentService/TalentOS.RecruitmentService.csproj src/TalentOS.RecruitmentService/
COPY src/TalentOS.PayrollService/TalentOS.PayrollService.csproj src/TalentOS.PayrollService/
COPY src/TalentOS.OperationsService/TalentOS.OperationsService.csproj src/TalentOS.OperationsService/

RUN dotnet restore src/TalentOS.Gateway/TalentOS.Gateway.csproj

COPY . .

RUN dotnet publish src/TalentOS.Gateway/TalentOS.Gateway.csproj -c Release -o /app/gateway
RUN dotnet publish src/TalentOS.IdentityService/TalentOS.IdentityService.csproj -c Release -o /app/identity
RUN dotnet publish src/TalentOS.EmployeeService/TalentOS.EmployeeService.csproj -c Release -o /app/employee
RUN dotnet publish src/TalentOS.RecruitmentService/TalentOS.RecruitmentService.csproj -c Release -o /app/recruitment
RUN dotnet publish src/TalentOS.PayrollService/TalentOS.PayrollService.csproj -c Release -o /app/payroll
RUN dotnet publish src/TalentOS.OperationsService/TalentOS.OperationsService.csproj -c Release -o /app/operations

# Stage 2: ASP.NET Core .NET 9 Production Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview as runner

WORKDIR /app

COPY --from=builder /app/gateway ./gateway
COPY --from=builder /app/identity ./identity
COPY --from=builder /app/employee ./employee
COPY --from=builder /app/recruitment ./recruitment
COPY --from=builder /app/payroll ./payroll
COPY --from=builder /app/operations ./operations

EXPOSE 5000 5001 5002 5003 5004 5005

ENV ASPNETCORE_URLS=http://+:5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["dotnet", "gateway/TalentOS.Gateway.dll"]

# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore

COPY . .

RUN dotnet publish -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

RUN mkdir -p /app/wwwroot/documents && \
    chown -R 65534:65534 /app/wwwroot

EXPOSE 80

ENTRYPOINT ["dotnet", "StudyLabAPI.dll"]
package config

import (
	"errors"
	"net"
	"net/url"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Address        string
	DatabaseURL    string
	FrontendOrigin string
	JWTSecret      string
	DBMaxOpen      int
	DBMaxIdle      int
}

func Load() (Config, error) {
	return Parse(os.Getenv)
}

// Parse accepts an environment reader so configuration is testable without globals.
func Parse(get func(string) string) (Config, error) {
	c := Config{
		Address:        get("API_ADDRESS"),
		DatabaseURL:    get("DATABASE_URL"),
		FrontendOrigin: get("FRONTEND_ORIGIN"),
		JWTSecret:      get("JWT_SECRET"),
		DBMaxOpen:      10,
		DBMaxIdle:      5,
	}
	if c.Address == "" {
		c.Address = ":8080"
	}
	_, port, err := net.SplitHostPort(c.Address)
	if err != nil {
		return Config{}, errors.New("API_ADDRESS must be a host:port")
	}
	portNumber, err := strconv.Atoi(port)
	if err != nil || portNumber < 1 || portNumber > 65535 {
		return Config{}, errors.New("API_ADDRESS must contain a port between 1 and 65535")
	}
	db, err := url.Parse(c.DatabaseURL)
	if err != nil || (db.Scheme != "postgres" && db.Scheme != "postgresql") || db.Host == "" || strings.Trim(db.Path, "/") == "" {
		return Config{}, errors.New("DATABASE_URL must be a PostgreSQL URL with a database name")
	}
	origin, err := url.Parse(c.FrontendOrigin)
	if err != nil || (origin.Scheme != "http" && origin.Scheme != "https") || origin.Host == "" || origin.User != nil || origin.RawQuery != "" || origin.Fragment != "" || origin.Path != "" {
		return Config{}, errors.New("FRONTEND_ORIGIN must be an exact HTTP(S) origin without a path")
	}
	if len(c.JWTSecret) < 32 || strings.TrimSpace(c.JWTSecret) != c.JWTSecret {
		return Config{}, errors.New("JWT_SECRET must contain at least 32 characters without surrounding whitespace")
	}
	for name, target := range map[string]*int{"DB_MAX_OPEN": &c.DBMaxOpen, "DB_MAX_IDLE": &c.DBMaxIdle} {
		if raw := get(name); raw != "" {
			n, parseErr := strconv.Atoi(raw)
			if parseErr != nil || n < 1 {
				return Config{}, errors.New(name + " must be a positive integer")
			}
			*target = n
		}
	}
	if c.DBMaxIdle > c.DBMaxOpen {
		return Config{}, errors.New("DB_MAX_IDLE must not exceed DB_MAX_OPEN")
	}
	return c, nil
}

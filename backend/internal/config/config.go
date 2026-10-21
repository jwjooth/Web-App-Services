package config

import (
	"errors"
	"fmt"
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
	pool := map[string]struct {
		target *int
		min    int
	}{
		"DB_MAX_OPEN": {target: &c.DBMaxOpen, min: 1},
		"DB_MAX_IDLE": {target: &c.DBMaxIdle, min: 0},
	}
	for name, p := range pool {
		raw := get(name)
		if raw == "" {
			continue
		}
		n, parseErr := strconv.Atoi(raw)
		if parseErr != nil || n < p.min {
			return Config{}, fmt.Errorf("%s must be an integer of at least %d", name, p.min)
		}
		*p.target = n
	}
	if c.DBMaxIdle > c.DBMaxOpen {
		return Config{}, errors.New("DB_MAX_IDLE must not exceed DB_MAX_OPEN")
	}
	return c, nil
}

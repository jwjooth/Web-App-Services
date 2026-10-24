package config

import "testing"

func TestParse(t *testing.T) {
	tests := []struct {
		name  string
		key   string
		value string
		fail  bool
	}{
		{name: "valid"},
		{name: "database required", key: "DATABASE_URL", fail: true},
		{name: "missing secret", key: "JWT_SECRET", value: "", fail: true},
		{name: "short secret", key: "JWT_SECRET", value: "short", fail: true},
		{name: "origin wildcard", key: "FRONTEND_ORIGIN", value: "*", fail: true},
		{name: "origin path", key: "FRONTEND_ORIGIN", value: "http://localhost:3000/path", fail: true},
		{name: "invalid pool", key: "DB_MAX_OPEN", value: "no", fail: true},
		{name: "pool bounds", key: "DB_MAX_IDLE", value: "11", fail: true},
		{name: "invalid address", key: "API_ADDRESS", value: "localhost", fail: true},
		{name: "nonnumeric port", key: "API_ADDRESS", value: ":http", fail: true},
		{name: "out of range port", key: "API_ADDRESS", value: ":65536", fail: true},
		{name: "missing database name", key: "DATABASE_URL", value: "postgres://localhost/", fail: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			env := map[string]string{
				"DATABASE_URL":    "postgres://shop:password@localhost:5432/shop?sslmode=disable",
				"FRONTEND_ORIGIN": "http://localhost:3000",
				"JWT_SECRET":      "test-only-secret-at-least-32-characters",
			}
			if tt.key != "" {
				env[tt.key] = tt.value
			}
			_, err := Parse(func(key string) string { return env[key] })
			if (err != nil) != tt.fail {
				t.Fatalf("Parse() error = %v, want failure %v", err, tt.fail)
			}
		})
	}
}

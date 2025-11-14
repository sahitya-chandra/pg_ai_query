# PostgreSQL AI Query Extension

A powerful PostgreSQL extension that generates SQL queries from natural language using state-of-the-art AI models from OpenAI and Anthropic.

## Features

- **Natural Language to SQL**: Convert plain English descriptions into valid PostgreSQL queries
- **Multiple AI Providers**: Support for both OpenAI (GPT-4, GPT-3.5) and Anthropic (Claude) models
- **Automatic Schema Discovery**: Analyzes your database schema to understand table structures and relationships
- **Intelligent Query Generation**: Creates optimized queries with appropriate JOINs, WHERE clauses, and LIMIT constraints
- **Configurable Response Formatting**: Choose between plain SQL, enhanced text with explanations, or structured JSON responses
- **Safety First**: Built-in protections against dangerous operations and unauthorized system table access
- **Flexible Configuration**: File-based configuration with support for API keys, model selection, and response formatting

## Quick Start

### Installation

1. **Prerequisites**:
   - PostgreSQL 12+ with development headers
   - CMake 3.16+
   - C++20 compatible compiler
   - API key from OpenAI or Anthropic

2. **Build and Install**:
   ```bash
   git clone --recurse-submodules https://github.com/benodiwal/pg_ai_query.git
   cd pg_ai_query
   mkdir build && cd build
   cmake ..
   make && sudo make install
   ```

3. **Enable Extension**:
   ```sql
   CREATE EXTENSION pg_ai_query;
   ```

### Configuration

Create `~/.pg_ai.config`:

```ini
[general]
log_level = "INFO"
enable_logging = false

[query]
enforce_limit = true
default_limit = 1000

[response]
show_explanation = true
show_warnings = true
show_suggested_visualization = false
use_formatted_response = false

[openai]
api_key = "your-openai-api-key-here"
default_model = "gpt-4o"

[anthropic]
api_key = "your-anthropic-api-key-here"
default_model = "claude-3-5-sonnet-20241022"
```

### Basic Usage

```sql
-- Generate simple queries
SELECT generate_query('show all customers');

-- Generate complex analytical queries
SELECT generate_query('monthly sales trend for the last year by category');

-- Generate queries with business logic
SELECT generate_query('customers who have not placed orders in the last 6 months');

-- Schema discovery functions
SELECT get_database_tables();
SELECT get_table_details('orders');
```

### Response Formats

**Plain SQL (default)**:
```sql
SELECT * FROM customers WHERE created_at >= NOW() - INTERVAL '7 days' LIMIT 1000;
```

**Enhanced with explanations and warnings**:
```sql
SELECT * FROM customers WHERE created_at >= NOW() - INTERVAL '7 days' LIMIT 1000;

-- Explanation:
-- Retrieves all customers who were created within the last 7 days

-- Warnings:
-- 1. Large dataset: Consider adding specific filters for better performance
```

**JSON format** (set `use_formatted_response = true`):
```json
{
  "query": "SELECT * FROM customers WHERE created_at >= NOW() - INTERVAL '7 days' LIMIT 1000;",
  "success": true,
  "explanation": "Retrieves all customers who were created within the last 7 days",
  "warnings": ["Large dataset: Consider adding specific filters for better performance"],
  "suggested_visualization": "table",
  "row_limit_applied": true
}
```

## Documentation

Complete documentation is available at: https://benodiwal.github.io/pg_ai_query/

- [Installation Guide](https://benodiwal.github.io/pg_ai_query/installation.html)
- [Configuration Reference](https://benodiwal.github.io/pg_ai_query/configuration.html)
- [Response Formatting](https://benodiwal.github.io/pg_ai_query/response-formatting.html)
- [Usage Examples](https://benodiwal.github.io/pg_ai_query/examples.html)
- [API Reference](https://benodiwal.github.io/pg_ai_query/api-reference.html)
- [Troubleshooting](https://benodiwal.github.io/pg_ai_query/troubleshooting.html)

## Safety and Security

- **System Table Protection**: Blocks access to `information_schema` and `pg_catalog`
- **Query Validation**: Validates generated SQL for safety
- **Limited Scope**: Only operates on user tables
- **Configurable Limits**: Built-in row limit enforcement
- **API Key Security**: Secure handling of API credentials

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## Support

- **Documentation**: https://benodiwal.github.io/pg_ai_query/
- **Issues**: [GitHub Issues](https://github.com/benodiwal/pg_ai_query/issues)
- **Discussions**: [GitHub Discussions](https://github.com/benodiwal/pg_ai_query/discussions)

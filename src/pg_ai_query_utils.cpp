#include "include/pg_ai_query_utils.hpp"

extern "C" {
#include <utils/builtins.h>
}

namespace pg_ai::utils {

std::string pg_text_to_string(const text* t) {
  if (!t)
    return "";
  char* cstr = text_to_cstring(t);
  try {
    std::string result(cstr);
    pfree(cstr);
    return result;
  } catch (...) {
    pfree(cstr);
    throw;
  }
}

}  // namespace pg_ai::utils

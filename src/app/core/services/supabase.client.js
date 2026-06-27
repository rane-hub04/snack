"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var environment_1 = require("../../../environments/environment");
exports.supabase = (0, supabase_js_1.createClient)(environment_1.environment.supabaseUrl, environment_1.environment.supabaseAnonKey);

"use client";

import { createContext } from "react";
import { RuntimeHQContextValue } from "../types";

export const RuntimeHQContext = createContext<RuntimeHQContextValue | null>(null);

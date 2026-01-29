"use client";

import { motion } from "motion/react";
import { PropsWithChildren } from "react";

export default function DashboardTemplate({ children }: PropsWithChildren) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}

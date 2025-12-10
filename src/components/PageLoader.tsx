import { motion } from "framer-motion";
import { Loader2, Cloud } from "lucide-react";

export const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
            >
                {/* Logo animé */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                        <Cloud className="w-10 h-10 text-white" />
                    </div>
                    {/* Effet de glow */}
                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl blur-xl opacity-50 -z-10" />
                </motion.div>

                {/* Texte de chargement */}
                <div className="flex flex-col items-center gap-2">
                    <motion.h2
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xl font-semibold text-foreground"
                    >
                        Cloud Industrie
                    </motion.h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Chargement...</span>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
};

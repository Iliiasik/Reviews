import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdministrationTab = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                ref={ref}
                key="administration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="px-6 py-5"
            >
                <div className="max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Инструменты</h2>
                    <div className="flex flex-col gap-3 items-start">
                        <motion.a
                            href="/api/admin/panel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary w-full text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
                        >
                            Админ панель
                        </motion.a>
                        <motion.a
                            href="http://localhost:9000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-accent w-full text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                        >
                            Объектное хранилище
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
});

AdministrationTab.displayName = 'AdministrationTab';

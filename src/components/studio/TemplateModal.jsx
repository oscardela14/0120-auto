
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const TemplateModal = ({ isOpen, onClose, templates, handleLoadTemplate }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface border border-white/10 rounded-xl p-6 max-w-2xl w-full"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">저장된 템플릿</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
                                    onClick={() => handleLoadTemplate(template)}
                                >
                                    <div>
                                        <h4 className="text-white font-semibold">{template.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">{template.platforms}개 플랫폼</span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-gray-500">사용 {template.usage}회</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors">
                                        불러오기
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

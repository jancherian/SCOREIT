import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-accent text-white font-semibold shadow-glow-orange hover:shadow-glow-orange-lg hover:bg-scoreit-600',
        secondary: 'bg-court-700 text-gray-100 border border-scoreit-500/50 hover:bg-court-600 hover:border-scoreit-500',
        outline: 'border border-scoreit-500/60 text-scoreit-400 hover:border-scoreit-500 hover:text-scoreit-300 hover:bg-scoreit-500/10',
        ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-surface-2/60',
        danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
        malachite: 'bg-scoreit-500 text-white font-semibold shadow-glow-orange hover:shadow-glow-orange-lg hover:bg-scoreit-600',
        glass: 'glass text-primary hover:bg-surface/80 shadow-sm',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-transparent',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </motion.button>
    );
};

export default Button;

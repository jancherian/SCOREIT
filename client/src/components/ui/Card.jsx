import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({
    className,
    children,
    hover = false,
    glass = false,
    noPadding = false,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                'rounded-2xl border shadow-sm transition-colors duration-200',
                glass
                    ? 'glass border-border-strong shadow-[0_0_0_1px_rgba(249,115,22,0.12),0_18px_40px_rgba(0,0,0,0.45)]'
                    : 'bg-surface border-border-strong shadow-[0_0_0_1px_rgba(249,115,22,0.12),0_18px_40px_rgba(0,0,0,0.45)]',
                !noPadding && 'p-6',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;

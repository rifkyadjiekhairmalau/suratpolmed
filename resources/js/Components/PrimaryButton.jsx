export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                // 👇 ubah 'text-xs' menjadi 'text-lg'
                `inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest ... ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

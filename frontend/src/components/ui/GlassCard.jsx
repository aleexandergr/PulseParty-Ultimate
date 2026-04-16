import clsx from 'clsx';

export default function GlassCard({ className = '', children }) {
  return <div className={clsx('glass rounded-[28px]', className)}>{children}</div>;
}

'use client';
import styles from './Skeleton.module.scss';

// Lightweight skeleton placeholder for loading states.
const Skeleton = ({ className = '', style }) => {
  const classes = className ? `${styles.skeleton} ${className}` : styles.skeleton;
  return <div className={classes} style={style} aria-hidden='true' />;
};

export default Skeleton;

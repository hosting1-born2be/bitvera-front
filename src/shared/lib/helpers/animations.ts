export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: customDelay },
  }),
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -50 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: customDelay },
  }),
};

export const fadeInUpSlow = {
  hidden: { opacity: 0, y: 50 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: customDelay },
  }),
};

export const fadeInDownSlow = {
  hidden: { opacity: 0, y: -50 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: customDelay },
  }),
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: customDelay },
  }),
};
export const fadeInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: customDelay },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: customDelay },
  }),
};

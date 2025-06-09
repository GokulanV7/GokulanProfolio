
import { useInView } from 'react-intersection-observer';

export function createParallaxEffect(element: HTMLElement, speed: number = 0.5, direction: 'vertical' | 'horizontal' = 'vertical', reverse: boolean = false) {
  if (!element) return () => {};
  
  const initialOffset = window.scrollY + element.getBoundingClientRect().top;
  const speedFactor = speed * (reverse ? -1 : 1);
  
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementHeight = element.getBoundingClientRect().height;
    
    // Check if element is in viewport with added buffer
    if (elementTop < windowHeight + 100 && elementTop + elementHeight > -100) {
      const offset = (scrollPosition - initialOffset) * speedFactor;
      
      if (direction === 'horizontal') {
        element.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run once to set initial position
  handleScroll();
  
  return () => window.removeEventListener('scroll', handleScroll);
}

export function useParallaxElements() {
  const elements = document.querySelectorAll('[data-parallax]');
  const cleanupFunctions: Array<() => void> = [];
  
  elements.forEach((element, index) => {
    // Different speeds and directions for varied effects
    const speed = 0.1 + (index * 0.05);
    const direction = index % 2 === 0 ? 'vertical' : 'horizontal';
    const reverse = index % 3 === 0;
    
    const cleanup = createParallaxEffect(
      element as HTMLElement, 
      speed, 
      direction,
      reverse
    );
    cleanupFunctions.push(cleanup);
  });
  
  return () => cleanupFunctions.forEach(cleanup => cleanup());
}

export function createMouseParallaxEffect(container: HTMLElement) {
  if (!container) return () => {};
  
  const elements = container.querySelectorAll('[data-parallax-mouse]');
  let lastMouseX = 0;
  let lastMouseY = 0;
  let animationFrame: number | null = null;
  
  const animate = () => {
    elements.forEach((element) => {
      const el = element as HTMLElement;
      const depth = parseFloat(el.dataset.depth || '0.05');
      const direction = el.dataset.direction || 'both';
      const inverse = el.dataset.inverse === 'true';
      const factor = inverse ? -1 : 1;
      
      let moveX = 0;
      let moveY = 0;
      
      if (direction === 'both' || direction === 'horizontal') {
        moveX = lastMouseX * depth * factor;
      }
      
      if (direction === 'both' || direction === 'vertical') {
        moveY = lastMouseY * depth * factor;
      }
      
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      el.style.transition = 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)';
    });
    
    animationFrame = null;
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const containerRect = container.getBoundingClientRect();
    
    const mouseX = (e.clientX - containerRect.left - containerRect.width / 2) / 20;
    const mouseY = (e.clientY - containerRect.top - containerRect.height / 2) / 20;
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  };
  
  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    
    const beta = e.beta; // -180 to 180 (x-axis)
    const gamma = e.gamma; // -90 to 90 (y-axis)
    
    // Normalize values to be similar to mouse movement range
    const moveX = (gamma / 9);
    const moveY = (beta / 9);
    
    lastMouseX = moveX;
    lastMouseY = moveY;
    
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  };
  
  container.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('deviceorientation', handleDeviceOrientation);
  
  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
}

export function applyParallaxToElements() {
  return new Promise<() => void>((resolve) => {
    setTimeout(() => {
      // Apply to all elements with data-parallax attribute
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      const cleanupFunctions: Array<() => void> = [];
      
      parallaxElements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.1');
        const direction = element.dataset.direction as 'vertical' | 'horizontal' || 'vertical';
        const reverse = element.dataset.reverse === 'true';
        
        const cleanup = createParallaxEffect(element, speed, direction, reverse);
        cleanupFunctions.push(cleanup);
      });
      
      // Apply mouse parallax to containers
      const mouseContainers = document.querySelectorAll('[data-parallax-container]');
      mouseContainers.forEach((container) => {
        const cleanup = createMouseParallaxEffect(container as HTMLElement);
        cleanupFunctions.push(cleanup);
      });
      
      resolve(() => cleanupFunctions.forEach(fn => fn()));
    }, 200);
  });
}

export function useParallaxInView(options = {}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    ...options
  });
  
  return { ref, inView };
}

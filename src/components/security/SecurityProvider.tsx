
import { ReactNode, useEffect } from 'react';
import { applySecurityMeasures } from '@/lib/security';

interface SecurityProviderProps {
  children: ReactNode;
  options?: {
    disableRightClick?: boolean;
    disableSelection?: boolean;
    disableDragging?: boolean;
    disableShortcuts?: boolean;
    preventEmbedding?: boolean;
    deter?: boolean;
    detectAdBlock?: boolean;
  };
}

const SecurityProvider = ({ 
  children, 
  options = {
    disableRightClick: true,
    disableSelection: true, 
    disableDragging: true,
    disableShortcuts: true,
    preventEmbedding: true,
    deter: true,
    detectAdBlock: false
  } 
}: SecurityProviderProps) => {
  useEffect(() => {
    // Ensure all required properties have defined values
    const securityOptions = {
      disableRightClick: options.disableRightClick ?? true,
      disableSelection: options.disableSelection ?? true,
      disableDragging: options.disableDragging ?? true,
      disableShortcuts: options.disableShortcuts ?? true,
      preventEmbedding: options.preventEmbedding ?? true,
      deter: options.deter ?? true,
      detectAdBlock: options.detectAdBlock ?? false
    };
    
    applySecurityMeasures(securityOptions);
  }, [options]);

  return <>{children}</>;
};

export default SecurityProvider;

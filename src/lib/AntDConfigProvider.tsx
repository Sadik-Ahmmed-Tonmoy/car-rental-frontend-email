import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; // optional reset

const AntDConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#02ACEE',
          
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntDConfigProvider;
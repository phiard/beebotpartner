import MainContainer from 'src/navigation/MainContainer';
import { AuthProvider } from 'src/navigation/AuthProvider';

const App = () => (
  <AuthProvider>
    <MainContainer />
  </AuthProvider>
);

export default App;
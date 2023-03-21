// 3rd party components
import { useEffect } from 'react';
// custom style components
import './home.css';
// custom layouts components
import MainLayout from '../components/layout/main-layout';
// custom context components


const HomePage = () => {

  useEffect(() => {    

  }, []);

  return (
    <MainLayout >
      <h1>Home page</h1>
    </MainLayout>
  );
};

export default HomePage;
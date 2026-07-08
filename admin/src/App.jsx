import React from 'react'
import Home from './pages/Home'
import Login from './pages/LoginPage'
import { Routes, Route } from 'react-router-dom';
import AddJobs from './pages/AddJobs';
import ListJob from './pages/ListJob';
import CompanyPage from './pages/ CompanyPage';
import CompanyQuestion from './pages/CompanyQuestion';
import ListCompanyQs from './pages/ListCompanyQs';
import RoleQuestion from './pages/RoleQuestion';
import ListRoleQs from './pages/ListRoleQs';
import ApplicantsPage from './pages/ApplicantsPage';

const App = () => {
  return (
    <div> 
      <div>
        <Routes>
          <Route path="/"element={<Home />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/addjobs" element={<AddJobs/>}/>
          <Route path="/list/jobs" element={<ListJob/>}/>
          <Route path="/companies" element={<CompanyPage/>}/>
          <Route path="/company-questions" element={<CompanyQuestion/>}/>
          <Route path="/list/company-questions" element={<ListCompanyQs/>}/>
        <Route path="/role-questions" element={<RoleQuestion/>}/>  
         <Route path="/list/role-questions" element={<ListRoleQs/>}/>  
         <Route path="/applicants" element={<ApplicantsPage/>}/>  
        </Routes>
      </div>
    </div>
  )
}

export default App
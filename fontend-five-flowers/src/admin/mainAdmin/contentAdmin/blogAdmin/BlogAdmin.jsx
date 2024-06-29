import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddBlogAdmin from './addBlogAdmin/AddBlogAdmin';
import GetAllBlogAdmin from './getAllBlogAdmin/GetAllBlogAdmin';
import UpdateBlogAdmin from './updateBlog/UpdateBlogAdmin';

const BlogAdmin = () => {
  return (
    <div>
      <h2>Add Blog Post</h2>
      <Routes>
        <Route path='add' element={<AddBlogAdmin />} />
        <Route index element={<GetAllBlogAdmin />} />
        <Route path='update' element={<UpdateBlogAdmin />} />
      </Routes>
    </div>
  );
}

export default BlogAdmin;

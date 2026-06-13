import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateBlogRequest, BlogResponse } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { 
  Image as ImageIcon, 
  Tag as TagIcon, 
  X, 
  Loader2, 
  Eye, 
  Edit3, 
  Upload, 
  Save 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { BlogCard } from './BlogCard';

// Zod Schema
const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be under 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  thumbnailUrl: z.string().min(1, 'Please upload or provide a cover image URL'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  initialData?: BlogResponse;
  onSubmit: (data: CreateBlogRequest) => Promise<void>;
  isSubmitting: boolean;
  titleText: string;
}

const CATEGORIES = ['Technology', 'Lifestyle', 'Design', 'Programming', 'Career'];

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  titleText,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [tagInput, setTagInput] = useState('');
  const { uploadFile, isUploading } = useProfile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      category: initialData?.category || CATEGORIES[0],
      tags: initialData?.tags || [],
    },
  });

  const formValues = watch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    try {
      const result = await uploadFile(file);
      // Backend returns string "File uploaded: filename.jpg" or the URL
      const filename = result.includes('File uploaded: ') 
        ? result.replace('File uploaded: ', '').trim() 
        : result;
      
      // Normally images can be accessed via a static link or base URL. We set the filename:
      const imageUrl = filename.startsWith('http') 
        ? filename 
        : `https://genzverse-backend.onrender.com/api/files/download/${filename}`;

      setValue('thumbnailUrl', imageUrl, { shouldValidate: true });
      toast.success('Cover image uploaded successfully!');
    } catch {
      toast.error('Failed to upload cover image.');
    }
  };

  const addTagsFromString = (str: string) => {
    const tagsToAdd = str
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tagsToAdd.length === 0) return;

    const currentTags = formValues.tags || [];
    const newTags = [...currentTags];
    let duplicateFound = false;
    let addedAny = false;

    tagsToAdd.forEach((tag) => {
      if (newTags.includes(tag)) {
        duplicateFound = true;
      } else {
        newTags.push(tag);
        addedAny = true;
      }
    });

    if (addedAny) {
      setValue('tags', newTags, { shouldValidate: true });
    }
    if (duplicateFound) {
      toast.warning('Duplicate tags ignored.');
    }
    setTagInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(' ') || val.endsWith(',')) {
      addTagsFromString(val);
    } else {
      setTagInput(val);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTagsFromString(tagInput);
    }
  };

  const handleBlur = () => {
    addTagsFromString(tagInput);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formValues.tags || [];
    setValue(
      'tags',
      currentTags.filter((t) => t !== tagToRemove),
      { shouldValidate: true }
    );
  };

  // Mock a BlogResponse structure for the Card Preview
  const mockBlogForPreview: BlogResponse = {
    id: initialData?.id || 999,
    title: formValues.title || 'Untitled Article',
    content: formValues.content || 'Start writing to see the preview...',
    thumbnailUrl: formValues.thumbnailUrl,
    category: formValues.category,
    tags: formValues.tags || [],
    author: initialData?.author || 'Current User',
    views: initialData?.views || 0,
    likes: initialData?.likes || 0,
    comments: initialData?.comments || 0,
    shares: initialData?.shares || 0,
    createdAt: initialData?.createdAt || new Date().toISOString(),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{titleText}</h1>
        
        {/* Editor vs Preview Tabs */}
        <div className="flex bg-slate-100/55 dark:bg-slate-950/45 p-1 rounded-xl w-fit border border-slate-200/20">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'edit' ? (
            <motion.form
              key="editor-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              
              {/* Cover Image Upload Card */}
              <div className="p-6 rounded-3xl border border-slate-250/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Cover Image
                </label>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Preview of upload image */}
                  <div className="md:col-span-5 aspect-video rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center overflow-hidden">
                    {formValues.thumbnailUrl ? (
                      <img
                        src={formValues.thumbnailUrl}
                        alt="Thumbnail Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-700 animate-pulse" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Upload a thumbnail image (JPEG/PNG/WebP, max 5MB) or enter a custom web image URL below.
                      </p>
                      
                      {/* File input button wrapper */}
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer w-fit hover:bg-slate-50 dark:hover:bg-slate-900 transition bg-white/60 dark:bg-slate-900/40">
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                        ) : (
                          <Upload className="h-4 w-4 text-indigo-500" />
                        )}
                        <span>{isUploading ? 'Uploading cover...' : 'Upload Image file'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        {...register('thumbnailUrl')}
                        type="text"
                        disabled={isSubmitting}
                        placeholder="Or type cover image URL..."
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 text-xs"
                      />
                    </div>
                    {errors.thumbnailUrl && (
                      <p className="text-[11px] font-semibold text-rose-500">{errors.thumbnailUrl.message}</p>
                    )}
                  </div>

                </div>
              </div>

              {/* Title & Category Form grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Title */}
                <div className="md:col-span-8 space-y-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Article Title
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Enter catching title..."
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm font-semibold"
                  />
                  {errors.title && (
                    <p className="text-[11px] font-semibold text-rose-500">{errors.title.message}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    disabled={isSubmitting}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[11px] font-semibold text-rose-500">{errors.category.message}</p>
                  )}
                </div>

              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tags
                </label>
                
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                  {/* Current Tags List */}
                  {formValues.tags && formValues.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/10"
                    >
                      <span>#{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="p-0.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  <div className="flex-1 min-w-[150px] relative">
                    <input
                      type="text"
                      placeholder="Add tag and press Enter..."
                      value={tagInput}
                      onChange={handleInputChange}
                      onKeyDown={handleAddTag}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      className="w-full h-8 px-2 bg-transparent text-xs focus:outline-none border-0"
                    />
                    <TagIcon className="absolute right-2 top-2 h-4 w-4 text-slate-350 dark:text-slate-650" />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Type a keyword and press **Space**, **Enter**, **, (comma)**, or click away to add.
                </p>
                {errors.tags && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.tags.message}</p>
                )}
              </div>

              {/* Editor Content Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Article Body Content
                </label>
                <textarea
                  {...register('content')}
                  disabled={isSubmitting}
                  placeholder="Tell your story. Support paragraphs and inline text formatting..."
                  rows={12}
                  className="w-full p-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm leading-relaxed"
                />
                {errors.content && (
                  <p className="text-[11px] font-semibold text-rose-500">{errors.content.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 px-6 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Saving publication...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      <span>Publish Blog</span>
                    </>
                  )}
                </motion.button>
              </div>

            </motion.form>
          ) : (
            <motion.div
              key="preview-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              
              {/* Blog Feed Card Mockup */}
              <div className="md:col-span-5 space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feed Card Mockup</p>
                <div className="max-w-sm">
                  <BlogCard blog={mockBlogForPreview} />
                </div>
              </div>

              {/* Article Detail View Mockup */}
              <div className="md:col-span-7 space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Post Mockup</p>
                
                <div className="p-6 rounded-3xl border border-slate-200/50 bg-white/80 dark:border-slate-800/50 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg space-y-6">
                  {/* Category */}
                  {mockBlogForPreview.category && (
                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {mockBlogForPreview.category}
                    </span>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-black leading-tight text-slate-850 dark:text-slate-100">
                    {mockBlogForPreview.title}
                  </h1>

                  {/* Author banner */}
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white flex items-center justify-center uppercase">
                      {mockBlogForPreview.author.substring(0, 2)}
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-350">{mockBlogForPreview.author}</span>
                      <span>Just now • 3 min read</span>
                    </div>
                  </div>

                  {/* Thumbnail Cover */}
                  {mockBlogForPreview.thumbnailUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
                      <img
                        src={mockBlogForPreview.thumbnailUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Body text */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                    {mockBlogForPreview.content}
                  </p>

                  {/* Tags */}
                  {mockBlogForPreview.tags && mockBlogForPreview.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {mockBlogForPreview.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
export default BlogEditor;

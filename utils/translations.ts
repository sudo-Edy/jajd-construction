export const translations = {
  en: {
    // Admin Login
    adminLogin: {
      title: 'Admin Login',
      subtitle: 'JAJD Construction Gallery Manager',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
      forgotPassword: 'Contact your administrator if you\'ve forgotten your password',
      invalidCredentials: 'Invalid email or password',
    },
    
    // Admin Dashboard
    dashboard: {
      title: 'Project Gallery Manager',
      subtitle: 'Manage your construction projects',
      logout: 'Logout',
      addNew: 'Add New Project',
      noProjects: 'No projects yet. Click "Add New Project" to get started!',
      photos: 'photos',
      published: 'Published',
      draft: 'Draft',
      edit: 'Edit project',
      delete: 'Delete project',
      publish: 'Publish',
      unpublish: 'Unpublish',
      confirmDelete: 'Are you sure you want to delete "{title}"? This cannot be undone.',
    },
    
    // Project Editor
    editor: {
      titleNew: 'New Project',
      titleEdit: 'Edit Project',
      subtitleNew: 'Add a new project to your gallery',
      subtitleEdit: 'Update project details and images',
      save: 'Save Project',
      saving: 'Saving...',
      cancel: 'Cancel',
      
      // Form fields
      projectTitle: 'Project Title',
      location: 'Location',
      shortDesc: 'Short Description',
      shortDescPlaceholder: 'Brief description shown on project card',
      detailedDesc: 'Detailed Description',
      detailedDescPlaceholder: 'Full details shown in the gallery modal',
      completionDate: 'Completion Date',
      displayOrder: 'Display Order',
      category: 'Category',
      status: 'Status',
      featured: 'Featured Project',
      publishedStatus: 'Published',
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Description',
      
      // Categories
      residential: 'Residential',
      commercial: 'Commercial',
      renovation: 'Renovation',
      newConstruction: 'New Construction',
      
      // Status
      completed: 'Completed',
      inProgress: 'In Progress',
      upcoming: 'Upcoming',
      
      // Images
      projectImages: 'Project Images',
      thumbnail: 'Thumbnail',
      setThumbnail: 'Set as Thumbnail',
      deleteImage: 'Delete this image',
      confirmDeleteImage: 'Are you sure you want to delete this image?',
      imageCaption: 'Image Caption',
      
      // Upload
      dropImages: 'Drop images here or click to browse',
      uploadSupport: 'Supports: JPG, PNG, GIF • Max size: 5MB per image',
      uploading: 'Uploading',
      uploaded: 'Uploaded',
      
      // Required
      required: 'Required field',
    },
  },
  
  es: {
    // Admin Login
    adminLogin: {
      title: 'Inicio de Sesión Admin',
      subtitle: 'Administrador de Galería JAJD Construction',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      signIn: 'Iniciar Sesión',
      signingIn: 'Iniciando Sesión...',
      forgotPassword: 'Contacte a su administrador si olvidó su contraseña',
      invalidCredentials: 'Correo electrónico o contraseña inválidos',
    },
    
    // Admin Dashboard
    dashboard: {
      title: 'Administrador de Galería de Proyectos',
      subtitle: 'Administre sus proyectos de construcción',
      logout: 'Cerrar Sesión',
      addNew: 'Agregar Nuevo Proyecto',
      noProjects: '¡Aún no hay proyectos. Haga clic en "Agregar Nuevo Proyecto" para comenzar!',
      photos: 'fotos',
      published: 'Publicado',
      draft: 'Borrador',
      edit: 'Editar proyecto',
      delete: 'Eliminar proyecto',
      publish: 'Publicar',
      unpublish: 'Despublicar',
      confirmDelete: '¿Está seguro de que desea eliminar "{title}"? Esto no se puede deshacer.',
    },
    
    // Project Editor
    editor: {
      titleNew: 'Nuevo Proyecto',
      titleEdit: 'Editar Proyecto',
      subtitleNew: 'Agregue un nuevo proyecto a su galería',
      subtitleEdit: 'Actualizar detalles e imágenes del proyecto',
      save: 'Guardar Proyecto',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      
      // Form fields
      projectTitle: 'Título del Proyecto',
      location: 'Ubicación',
      shortDesc: 'Descripción Corta',
      shortDescPlaceholder: 'Breve descripción mostrada en la tarjeta del proyecto',
      detailedDesc: 'Descripción Detallada',
      detailedDescPlaceholder: 'Detalles completos mostrados en el modal de galería',
      completionDate: 'Fecha de Finalización',
      displayOrder: 'Orden de Visualización',
      category: 'Categoría',
      status: 'Estado',
      featured: 'Proyecto Destacado',
      publishedStatus: 'Publicado',
      seoTitle: 'Título SEO',
      seoDescription: 'Descripción SEO',
      
      // Categories
      residential: 'Residencial',
      commercial: 'Comercial',
      renovation: 'Renovación',
      newConstruction: 'Nueva Construcción',
      
      // Status
      completed: 'Completado',
      inProgress: 'En Progreso',
      upcoming: 'Próximo',
      
      // Images
      projectImages: 'Imágenes del Proyecto',
      thumbnail: 'Miniatura',
      setThumbnail: 'Establecer como Miniatura',
      deleteImage: 'Eliminar esta imagen',
      confirmDeleteImage: '¿Está seguro de que desea eliminar esta imagen?',
      imageCaption: 'Título de Imagen',
      
      // Upload
      dropImages: 'Suelte imágenes aquí o haga clic para explorar',
      uploadSupport: 'Soporta: JPG, PNG, GIF • Tamaño máx: 5MB por imagen',
      uploading: 'Subiendo',
      uploaded: 'Subido',
      
      // Required
      required: 'Campo requerido',
    },
  },
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

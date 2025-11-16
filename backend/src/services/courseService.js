import axios from 'axios';

class CourseService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.baseURL = 'https://paid-udemy-course-for-free.p.rapidapi.com';
  }

  // Get free Udemy courses
  async getFreeCourses(page = 0, category = '') {
    try {
      const response = await axios.get(`${this.baseURL}/`, {
        params: { page },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'paid-udemy-course-for-free.p.rapidapi.com'
        }
      });

      return response.data.map(course => ({
        id: course.id || Math.random().toString(36),
        title: course.title,
        description: course.description || course.headline,
        instructor: course.instructor || 'Unknown',
        duration: course.duration || 'Self-paced',
        level: course.level || 'Beginner',
        rating: course.rating || 4.0,
        students: course.num_subscribers || 0,
        price: 'Free',
        originalPrice: course.price || '$99',
        imageUrl: course.image_480x270 || course.image,
        url: course.url,
        category: course.category || 'Technology',
        skills: course.what_you_will_learn || [],
        provider: 'Udemy'
      }));
    } catch (error) {
      console.error('Free courses error:', error);
      return this.getFallbackCourses();
    }
  }

  // Get courses by skill/category
  async getCoursesBySkill(skill, limit = 10) {
    try {
      const courses = await this.getFreeCourses(0);
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(skill.toLowerCase()) ||
        course.description.toLowerCase().includes(skill.toLowerCase()) ||
        course.category.toLowerCase().includes(skill.toLowerCase())
      );
      
      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Courses by skill error:', error);
      return this.getFallbackCoursesBySkill(skill);
    }
  }

  // Get recommended courses based on user profile
  async getRecommendedCourses(userSkills, userLevel = 'beginner') {
    try {
      const allCourses = await this.getFreeCourses(0);
      const recommended = [];

      for (const skill of userSkills) {
        const skillCourses = allCourses.filter(course => 
          course.title.toLowerCase().includes(skill.toLowerCase()) ||
          course.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        );
        
        recommended.push(...skillCourses.slice(0, 2));
      }

      // Remove duplicates and sort by rating
      const unique = recommended.filter((course, index, self) => 
        index === self.findIndex(c => c.id === course.id)
      );

      return unique.sort((a, b) => b.rating - a.rating).slice(0, 12);
    } catch (error) {
      console.error('Recommended courses error:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Get course categories
  async getCategories() {
    try {
      const courses = await this.getFreeCourses(0);
      const categories = [...new Set(courses.map(c => c.category))];
      
      return categories.map(cat => ({
        name: cat,
        count: courses.filter(c => c.category === cat).length,
        icon: this.getCategoryIcon(cat)
      }));
    } catch (error) {
      console.error('Categories error:', error);
      return this.getFallbackCategories();
    }
  }

  // Get trending courses
  async getTrendingCourses() {
    try {
      const courses = await this.getFreeCourses(0);
      return courses
        .sort((a, b) => b.students - a.students)
        .slice(0, 8);
    } catch (error) {
      console.error('Trending courses error:', error);
      return this.getFallbackTrending();
    }
  }

  // Helper methods
  getCategoryIcon(category) {
    const icons = {
      'Technology': '💻',
      'Business': '💼',
      'Design': '🎨',
      'Marketing': '📈',
      'Development': '⚡',
      'Data Science': '📊',
      'Photography': '📸',
      'Music': '🎵',
      'Health': '🏥',
      'Language': '🗣️'
    };
    return icons[category] || '📚';
  }

  // Fallback data when API fails
  getFallbackCourses() {
    return [
      {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript from scratch',
        instructor: 'Tech Academy',
        duration: '8 hours',
        level: 'Beginner',
        rating: 4.5,
        students: 15000,
        price: 'Free',
        originalPrice: '$99',
        imageUrl: 'https://via.placeholder.com/480x270?text=JavaScript',
        url: '#',
        category: 'Technology',
        skills: ['JavaScript', 'Programming', 'Web Development'],
        provider: 'Udemy'
      },
      {
        id: 'react-intro',
        title: 'React for Beginners',
        description: 'Build modern web apps with React',
        instructor: 'Code Master',
        duration: '12 hours',
        level: 'Intermediate',
        rating: 4.7,
        students: 8500,
        price: 'Free',
        originalPrice: '$149',
        imageUrl: 'https://via.placeholder.com/480x270?text=React',
        url: '#',
        category: 'Technology',
        skills: ['React', 'JavaScript', 'Frontend'],
        provider: 'Udemy'
      }
    ];
  }

  getFallbackCoursesBySkill(skill) {
    return this.getFallbackCourses().filter(course => 
      course.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  getFallbackRecommendations() {
    return this.getFallbackCourses();
  }

  getFallbackCategories() {
    return [
      { name: 'Technology', count: 150, icon: '💻' },
      { name: 'Business', count: 89, icon: '💼' },
      { name: 'Design', count: 67, icon: '🎨' },
      { name: 'Marketing', count: 45, icon: '📈' }
    ];
  }

  getFallbackTrending() {
    return this.getFallbackCourses();
  }
}

export default CourseService;
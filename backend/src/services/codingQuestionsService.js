import { prisma } from '../config/prisma.js';

class CodingQuestionsService {
  constructor() {
    this.initializeQuestions();
  }

  async initializeQuestions() {
    // Check if questions already exist
    const count = await prisma.codingQuestion.count();
    if (count > 0) return;

    // Seed initial questions
    const questions = this.getQuestionDatabase();
    
    try {
      for (const question of questions) {
        await prisma.codingQuestion.create({
          data: question
        });
      }
      console.log('✅ Coding questions database initialized');
    } catch (error) {
      console.log('ℹ️ Questions may already exist');
    }
  }

  getQuestionDatabase() {
    return [
      // ARRAYS - Easy
      {
        title: 'Two Sum',
        slug: 'two-sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: 'Easy',
        topic: 'Arrays',
        company: 'Google',
        platform: 'LeetCode',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
          { input: 'nums = [3,3], target = 6', output: '[0,1]' }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists'
        ],
        hints: [
          'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
          'Use a hash map to store the complement of each number as you iterate through the array.'
        ],
        solution: {
          python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
          javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
          java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i);
    }
    return new int[] {};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`
        },
        tags: ['array', 'hash-table', 'google', 'easy'],
        frequency: 95,
        acceptance: 49
      },
      // ARRAYS - Medium
      {
        title: 'Best Time to Buy and Sell Stock',
        slug: 'best-time-to-buy-and-sell-stock',
        description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
        difficulty: 'Easy',
        topic: 'Arrays',
        company: 'Amazon',
        platform: 'LeetCode',
        examples: [
          { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
          { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transactions are done and the max profit = 0.' }
        ],
        constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
        hints: ['Keep track of the minimum price seen so far', 'Calculate profit at each step'],
        solution: {
          python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
          javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
          java: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
          cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        maxProfit = max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`
        },
        tags: ['array', 'dynamic-programming', 'amazon', 'easy'],
        frequency: 88,
        acceptance: 54
      },

      // STRINGS - Easy
      {
        title: 'Valid Palindrome',
        slug: 'valid-palindrome',
        description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
        difficulty: 'Easy',
        topic: 'Strings',
        company: 'Facebook',
        platform: 'LeetCode',
        examples: [
          { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
          { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
        ],
        constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
        hints: ['Use two pointers from both ends', 'Skip non-alphanumeric characters'],
        solution: {
          python: `def isPalindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
          javascript: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) left++;
        while (left < right && !isAlphanumeric(s[right])) right--;
        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
        left++;
        right--;
    }
    return true;
}

function isAlphanumeric(char) {
    return /[a-zA-Z0-9]/.test(char);
}`,
          java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
          cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`
        },
        tags: ['string', 'two-pointers', 'facebook', 'easy'],
        frequency: 76,
        acceptance: 42
      },

      // LINKED LISTS - Easy
      {
        title: 'Reverse Linked List',
        slug: 'reverse-linked-list',
        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
        difficulty: 'Easy',
        topic: 'Linked Lists',
        company: 'Microsoft',
        platform: 'LeetCode',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', output: '[2,1]' },
          { input: 'head = []', output: '[]' }
        ],
        constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
        hints: ['Use three pointers: prev, current, and next', 'Iteratively reverse the links'],
        solution: {
          python: `def reverseList(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev`,
          javascript: `function reverseList(head) {
    let prev = null;
    let current = head;
    while (current) {
        const nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    return prev;
}`,
          java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    while (current != null) {
        ListNode nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    return prev;
}`,
          cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    while (current) {
        ListNode* nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    return prev;
}`
        },
        tags: ['linked-list', 'recursion', 'microsoft', 'easy'],
        frequency: 92,
        acceptance: 71
      },

      // TREES - Easy
      {
        title: 'Maximum Depth of Binary Tree',
        slug: 'maximum-depth-of-binary-tree',
        description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
        difficulty: 'Easy',
        topic: 'Trees',
        company: 'Apple',
        platform: 'LeetCode',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
          { input: 'root = [1,null,2]', output: '2' }
        ],
        constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
        hints: ['Use recursion', 'The depth is 1 + max(left depth, right depth)'],
        solution: {
          python: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
          javascript: `function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`
        },
        tags: ['tree', 'depth-first-search', 'recursion', 'apple', 'easy'],
        frequency: 85,
        acceptance: 74
      },

      // DYNAMIC PROGRAMMING - Medium
      {
        title: 'Climbing Stairs',
        slug: 'climbing-stairs',
        description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        company: 'Google',
        platform: 'LeetCode',
        examples: [
          { input: 'n = 2', output: '2', explanation: 'There are two ways: 1+1 and 2.' },
          { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.' }
        ],
        constraints: ['1 <= n <= 45'],
        hints: ['This is a Fibonacci sequence problem', 'Use dynamic programming or memoization'],
        solution: {
          python: `def climbStairs(n):
    if n <= 2:
        return n
    prev, curr = 1, 2
    for i in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
          javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let prev = 1, curr = 2;
    for (let i = 3; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
    }
    return curr;
}`,
          java: `public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev = 1, curr = 2;
    for (int i = 3; i <= n; i++) {
        int temp = curr;
        curr = prev + curr;
        prev = temp;
    }
    return curr;
}`,
          cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev = 1, curr = 2;
    for (int i = 3; i <= n; i++) {
        int temp = curr;
        curr = prev + curr;
        prev = temp;
    }
    return curr;
}`
        },
        tags: ['dynamic-programming', 'math', 'google', 'easy'],
        frequency: 81,
        acceptance: 51
      }
    ];
  }

  // Get questions with filters
  async getQuestions(filters = {}) {
    const where = {};
    
    if (filters.company) {
      where.company = { contains: filters.company, mode: 'insensitive' };
    }
    if (filters.topic) {
      where.topic = { contains: filters.topic, mode: 'insensitive' };
    }
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters.platform) {
      where.platform = { contains: filters.platform, mode: 'insensitive' };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.codingQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { frequency: 'desc' }
      }),
      prisma.codingQuestion.count({ where })
    ]);

    return {
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get question by ID
  async getQuestionById(id) {
    return await prisma.codingQuestion.findUnique({
      where: { id: parseInt(id) }
    });
  }

  // Submit solution
  async submitSolution(data) {
    const { questionId, userId, code, language, testResults } = data;

    // Create submission
    const submission = await prisma.codingSubmission.create({
      data: {
        userId,
        questionId: parseInt(questionId),
        code,
        language,
        status: testResults?.passed ? 'Accepted' : 'Wrong Answer',
        runtime: testResults?.runtime || null,
        memory: testResults?.memory || null,
        testResults: testResults || {}
      }
    });

    // Update progress if accepted
    if (testResults?.passed) {
      await this.updateProgress(userId, questionId);
    }

    return submission;
  }

  // Update user progress
  async updateProgress(userId, questionId) {
    const question = await prisma.codingQuestion.findUnique({
      where: { id: parseInt(questionId) }
    });

    let progress = await prisma.codingProgress.findUnique({
      where: { userId }
    });

    if (!progress) {
      progress = await prisma.codingProgress.create({
        data: {
          userId,
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          streak: 0,
          solvedQuestions: []
        }
      });
    }

    const solvedQuestions = progress.solvedQuestions || [];
    if (!solvedQuestions.includes(questionId)) {
      solvedQuestions.push(questionId);

      const updateData = {
        totalSolved: progress.totalSolved + 1,
        solvedQuestions,
        lastSolvedDate: new Date()
      };

      // Update difficulty counts
      if (question.difficulty === 'Easy') {
        updateData.easySolved = progress.easySolved + 1;
      } else if (question.difficulty === 'Medium') {
        updateData.mediumSolved = progress.mediumSolved + 1;
      } else if (question.difficulty === 'Hard') {
        updateData.hardSolved = progress.hardSolved + 1;
      }

      // Update streak
      const lastSolved = progress.lastSolvedDate;
      const today = new Date();
      if (lastSolved) {
        const daysDiff = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          updateData.streak = progress.streak + 1;
        } else if (daysDiff > 1) {
          updateData.streak = 1;
        }
      } else {
        updateData.streak = 1;
      }

      await prisma.codingProgress.update({
        where: { userId },
        data: updateData
      });
    }
  }

  // Get user progress
  async getUserProgress(userId) {
    let progress = await prisma.codingProgress.findUnique({
      where: { userId }
    });

    if (!progress) {
      progress = await prisma.codingProgress.create({
        data: {
          userId,
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          streak: 0,
          solvedQuestions: []
        }
      });
    }

    // Get recent submissions
    const recentSubmissions = await prisma.codingSubmission.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { submittedAt: 'desc' },
      take: 10
    });

    return {
      ...progress,
      recentSubmissions: recentSubmissions.map(sub => ({
        questionId: sub.questionId,
        title: sub.question.title,
        status: sub.status,
        submittedAt: sub.submittedAt
      }))
    };
  }

  // Get companies
  async getCompanies() {
    const companies = await prisma.codingQuestion.groupBy({
      by: ['company'],
      _count: { company: true }
    });

    return companies.map(c => ({
      name: c.company,
      questionCount: c._count.company,
      logo: `/logos/${c.company.toLowerCase()}.png`
    }));
  }

  // Get topics
  async getTopics() {
    const topics = await prisma.codingQuestion.groupBy({
      by: ['topic'],
      _count: { topic: true }
    });

    const topicsWithDifficulty = await Promise.all(
      topics.map(async (t) => {
        const difficulties = await prisma.codingQuestion.groupBy({
          by: ['difficulty'],
          where: { topic: t.topic },
          _count: { difficulty: true }
        });

        const difficultyMap = {
          easy: 0,
          medium: 0,
          hard: 0
        };

        difficulties.forEach(d => {
          difficultyMap[d.difficulty.toLowerCase()] = d._count.difficulty;
        });

        return {
          name: t.topic,
          questionCount: t._count.topic,
          difficulty: difficultyMap
        };
      })
    );

    return topicsWithDifficulty;
  }

  // Get user statistics
  async getUserStats(userId) {
    const progress = await this.getUserProgress(userId);
    const totalQuestions = await prisma.codingQuestion.count();

    // Get submissions for accuracy calculation
    const submissions = await prisma.codingSubmission.findMany({
      where: { userId }
    });

    const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
    const accuracy = submissions.length > 0 
      ? Math.round((acceptedCount / submissions.length) * 100) 
      : 0;

    // Get weekly progress
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklySubmissions = await prisma.codingSubmission.findMany({
      where: {
        userId,
        submittedAt: { gte: weekAgo },
        status: 'Accepted'
      },
      include: { question: true }
    });

    const weeklyProgress = this.calculateWeeklyProgress(weeklySubmissions);

    // Get company progress
    const companyProgress = await this.getCompanyProgress(userId);

    return {
      totalQuestions,
      solvedQuestions: progress.totalSolved,
      accuracy,
      averageTime: Math.floor(Math.random() * 60) + 30, // Mock for now
      favoriteTopics: progress.favoriteTopics || [],
      weeklyProgress,
      companyProgress
    };
  }

  calculateWeeklyProgress(submissions) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const progress = days.map(day => ({ day, solved: 0 }));

    submissions.forEach(sub => {
      const dayIndex = new Date(sub.submittedAt).getDay();
      progress[dayIndex].solved++;
    });

    return progress;
  }

  async getCompanyProgress(userId) {
    const companies = ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple'];
    const progress = [];

    for (const company of companies) {
      const total = await prisma.codingQuestion.count({
        where: { company }
      });

      const solved = await prisma.codingSubmission.count({
        where: {
          userId,
          status: 'Accepted',
          question: { company }
        },
        distinct: ['questionId']
      });

      progress.push({ company, solved, total });
    }

    return progress;
  }
}

export default CodingQuestionsService;

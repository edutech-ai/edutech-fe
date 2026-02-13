export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readingTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "ai-ho-tro-giao-vien-soan-bai-nhu-the-nao",
    title: "AI hỗ trợ giáo viên soạn bài như thế nào?",
    excerpt:
      "Khám phá cách công nghệ AI đang thay đổi cách giáo viên chuẩn bị bài giảng, từ việc tạo giáo án tự động đến gợi ý nội dung phù hợp với từng đối tượng học sinh.",
    content: `
## AI đang thay đổi cách giáo viên soạn bài

Trong thời đại công nghệ 4.0, việc ứng dụng AI vào giáo dục không còn là điều xa vời. Giáo viên trên toàn thế giới đang dần làm quen với các công cụ AI để hỗ trợ công việc giảng dạy hàng ngày.

### Những lợi ích của AI trong soạn bài

**1. Tiết kiệm thời gian đáng kể**

Trung bình, một giáo viên dành 2-3 tiếng để soạn một giáo án hoàn chỉnh. Với AI, thời gian này có thể giảm xuống còn 15-30 phút. AI có thể:
- Tự động tạo dàn bài dựa trên chủ đề
- Gợi ý các hoạt động học tập phù hợp
- Tạo câu hỏi kiểm tra theo mức độ khó

**2. Cá nhân hóa nội dung học tập**

AI có khả năng phân tích dữ liệu học sinh để đề xuất nội dung phù hợp với từng đối tượng. Điều này giúp giáo viên:
- Điều chỉnh độ khó của bài học
- Tạo bài tập bổ trợ cho học sinh yếu
- Chuẩn bị nội dung nâng cao cho học sinh giỏi

**3. Đảm bảo chuẩn chương trình**

Các công cụ AI giáo dục như AI EduTech được xây dựng dựa trên khung chương trình của Bộ Giáo dục, đảm bảo giáo án luôn đúng chuẩn và cập nhật.

### Cách sử dụng AI hiệu quả

1. **Xác định mục tiêu bài học rõ ràng** - AI cần input tốt để cho output tốt
2. **Review và chỉnh sửa** - AI là công cụ hỗ trợ, không thay thế giáo viên
3. **Kết hợp kinh nghiệm cá nhân** - Thêm các ví dụ thực tế từ kinh nghiệm giảng dạy

### Kết luận

AI không thay thế giáo viên, mà trao quyền cho giáo viên. Bằng cách sử dụng AI một cách thông minh, giáo viên có thể dành nhiều thời gian hơn cho việc tương tác với học sinh - điều mà không công nghệ nào có thể thay thế.
    `,
    thumbnail: "/images/blog/ai-soan-bai.jpg",
    category: "AI trong giáo dục",
    tags: ["AI", "soạn bài", "giáo án", "công nghệ giáo dục"],
    author: {
      name: "Nguyễn Văn An",
      avatar: "/images/avatars/author-1.jpg",
      role: "Chuyên gia Công nghệ Giáo dục",
    },
    publishedAt: "2026-01-15",
    readingTime: 5,
  },
  {
    id: "2",
    slug: "5-cach-quan-ly-lop-hoc-hieu-qua-voi-cong-nghe",
    title: "5 cách quản lý lớp học hiệu quả với công nghệ",
    excerpt:
      "Tìm hiểu các phương pháp quản lý lớp học hiện đại, từ sơ đồ chỗ ngồi số hóa đến theo dõi tiến độ học tập real-time.",
    content: `
## Quản lý lớp học trong thời đại số

Quản lý lớp học là một trong những thách thức lớn nhất của giáo viên. Với sự hỗ trợ của công nghệ, việc này trở nên đơn giản và hiệu quả hơn bao giờ hết.

### 1. Sơ đồ chỗ ngồi số hóa

Thay vì ghi nhớ hoặc vẽ tay, giáo viên có thể sử dụng phần mềm để:
- Tạo sơ đồ lớp học trực quan
- Dễ dàng thay đổi vị trí học sinh
- Ghi chú nhanh về từng học sinh

### 2. Random học sinh công bằng

Việc gọi học sinh trả lời câu hỏi cần công bằng và không thiên vị. Công cụ random giúp:
- Đảm bảo mọi học sinh đều có cơ hội
- Tăng sự tập trung của cả lớp
- Giảm áp lực cho giáo viên khi chọn người

### 3. Theo dõi chuyên cần tự động

Điểm danh thủ công tốn thời gian và dễ sai sót. Hệ thống số hóa cho phép:
- Điểm danh nhanh chóng
- Thống kê tự động theo tuần/tháng
- Phát hiện xu hướng nghỉ học

### 4. Dashboard tiến độ học tập

Một dashboard tổng hợp giúp giáo viên:
- Nhìn tổng quan về cả lớp trong một màn hình
- Phát hiện học sinh cần hỗ trợ
- Theo dõi sự tiến bộ theo thời gian

### 5. Báo cáo tự động

Cuối kỳ, việc viết nhận xét cho từng học sinh rất tốn thời gian. Công nghệ giúp:
- Tự động tổng hợp dữ liệu
- Gợi ý nhận xét dựa trên kết quả
- Xuất báo cáo PDF chuyên nghiệp

### Bắt đầu từ đâu?

Không cần áp dụng tất cả cùng lúc. Hãy bắt đầu với một công cụ đơn giản như sơ đồ chỗ ngồi, sau đó dần mở rộng khi đã quen.
    `,
    thumbnail: "/images/blog/quan-ly-lop-hoc.jpg",
    category: "Kỹ năng giảng dạy",
    tags: ["quản lý lớp học", "công nghệ", "tips giáo viên", "classroom"],
    author: {
      name: "Trần Thị Mai",
      avatar: "/images/avatars/author-2.jpg",
      role: "Giáo viên THPT",
    },
    publishedAt: "2026-01-10",
    readingTime: 4,
  },
  {
    id: "3",
    slug: "tao-de-thi-trac-nghiem-chuyen-nghiep-trong-5-phut",
    title: "Tạo đề thi trắc nghiệm chuyên nghiệp trong 5 phút",
    excerpt:
      "Hướng dẫn chi tiết cách sử dụng AI để tạo đề thi trắc nghiệm đa dạng, đảm bảo chất lượng và tiết kiệm thời gian.",
    content: `
## Tạo đề thi không còn là nỗi lo

Việc tạo đề thi trắc nghiệm chất lượng thường mất hàng giờ: nghĩ câu hỏi, viết đáp án nhiễu, cân đối độ khó... AI có thể giúp giáo viên hoàn thành trong vài phút.

### Bước 1: Xác định ma trận đề thi

Trước khi tạo đề, cần xác định rõ:
- **Nội dung kiến thức**: Các chương/bài cần kiểm tra
- **Mức độ nhận thức**: Nhớ, hiểu, vận dụng, vận dụng cao
- **Số câu hỏi**: Phân bố theo từng phần

### Bước 2: Sử dụng AI tạo câu hỏi

AI có thể tạo câu hỏi dựa trên:
- Nội dung sách giáo khoa
- Tài liệu bạn upload
- Từ khóa và chủ đề

**Tips**: Cung cấp càng nhiều ngữ cảnh, câu hỏi càng chất lượng.

### Bước 3: Review và chỉnh sửa

AI tạo câu hỏi nhanh, nhưng giáo viên cần:
- Kiểm tra tính chính xác
- Điều chỉnh ngôn ngữ phù hợp
- Loại bỏ câu hỏi trùng lặp hoặc không phù hợp

### Bước 4: Tạo nhiều phiên bản đề

Để tránh học sinh chép bài nhau, cần nhiều phiên bản đề khác nhau. AI có thể:
- Tự động đảo thứ tự câu hỏi
- Đảo thứ tự đáp án
- Tạo đề hoàn toàn mới với cùng ma trận

### Bước 5: Xuất và in ấn

Sau khi hoàn thành, xuất đề dưới dạng:
- PDF để in
- Word để chỉnh sửa thêm
- Online để thi trực tuyến

### Lưu ý quan trọng

- Luôn kiểm tra đáp án trước khi sử dụng
- Thử giải đề một lần để đảm bảo không có lỗi
- Lưu trữ đề để tái sử dụng hoặc tham khảo

Với AI EduTech, việc tạo đề thi chuyên nghiệp chỉ còn là chuyện vài phút!
    `,
    thumbnail: "/images/blog/tao-de-thi.jpg",
    category: "Hướng dẫn",
    tags: ["đề thi", "trắc nghiệm", "AI", "hướng dẫn"],
    author: {
      name: "Lê Hoàng Nam",
      avatar: "/images/avatars/author-3.jpg",
      role: "Giáo viên Toán",
    },
    publishedAt: "2026-01-05",
    readingTime: 6,
  },
  {
    id: "4",
    slug: "xu-huong-cong-nghe-giao-duc-2026",
    title: "Xu hướng công nghệ giáo dục năm 2026",
    excerpt:
      "Điểm qua những xu hướng EdTech nổi bật trong năm 2026: AI cá nhân hóa, VR/AR trong lớp học, và học tập thích ứng.",
    content: `
## Công nghệ giáo dục năm 2026: Những điều đáng chờ đợi

Năm 2026 đánh dấu bước tiến lớn trong việc ứng dụng công nghệ vào giáo dục. Dưới đây là những xu hướng nổi bật.

### 1. AI cá nhân hóa học tập

AI không còn chỉ là công cụ hỗ trợ mà trở thành "trợ giảng ảo" cho từng học sinh:
- Phân tích điểm mạnh/yếu của từng em
- Đề xuất lộ trình học tập riêng
- Điều chỉnh độ khó real-time

### 2. VR/AR trong lớp học

Thực tế ảo và thực tế tăng cường mang đến trải nghiệm học tập sống động:
- Tham quan bảo tàng ảo trong giờ Lịch sử
- Thực hành thí nghiệm an toàn trong giờ Hóa học
- Khám phá vũ trụ trong giờ Vật lý

### 3. Học tập thích ứng (Adaptive Learning)

Hệ thống tự động điều chỉnh nội dung dựa trên phản hồi của học sinh:
- Nếu làm sai, hệ thống giải thích và cho bài tương tự
- Nếu làm đúng, tăng độ khó dần dần
- Đảm bảo mỗi học sinh tiến bộ theo tốc độ riêng

### 4. Gamification (Game hóa)

Biến việc học thành trò chơi để tăng hứng thú:
- Hệ thống điểm và huy hiệu
- Bảng xếp hạng lớp học
- Nhiệm vụ và phần thưởng

### 5. Data-driven decision making

Giáo viên đưa ra quyết định dựa trên dữ liệu:
- Phân tích kết quả học tập chi tiết
- Dự đoán học sinh có nguy cơ tụt hậu
- Đánh giá hiệu quả phương pháp giảng dạy

### Kết luận

Công nghệ đang mở ra những cơ hội mới cho giáo dục. Giáo viên không cần lo sợ bị thay thế, mà nên xem đây là công cụ để giảng dạy hiệu quả hơn.
    `,
    thumbnail: "/images/blog/edtech-trends.jpg",
    category: "Xu hướng",
    tags: ["EdTech", "xu hướng", "AI", "VR", "2026"],
    author: {
      name: "Phạm Minh Tuấn",
      avatar: "/images/avatars/author-4.jpg",
      role: "Nhà nghiên cứu Giáo dục",
    },
    publishedAt: "2026-01-01",
    readingTime: 5,
  },
  {
    id: "5",
    slug: "cham-bai-tu-luan-bang-ai-co-chinh-xac-khong",
    title: "Chấm bài tự luận bằng AI có chính xác không?",
    excerpt:
      "Phân tích ưu nhược điểm của việc sử dụng AI để chấm bài tự luận, và cách kết hợp AI với đánh giá của giáo viên.",
    content: `
## AI chấm bài tự luận: Thực hư như thế nào?

Việc AI có thể chấm bài trắc nghiệm là điều hiển nhiên. Nhưng với bài tự luận - nơi đòi hỏi sự đánh giá chủ quan - AI liệu có làm được?

### AI chấm bài tự luận hoạt động như thế nào?

Các hệ thống AI hiện đại sử dụng:
- **NLP (Xử lý ngôn ngữ tự nhiên)**: Hiểu nội dung bài viết
- **Machine Learning**: Học từ hàng triệu bài đã được chấm
- **Rubric-based scoring**: Chấm theo tiêu chí định sẵn

### Ưu điểm

**1. Tốc độ**
- Chấm hàng trăm bài trong vài phút
- Giáo viên có thể trả bài ngay trong buổi học sau

**2. Nhất quán**
- Không bị ảnh hưởng bởi tâm trạng
- Áp dụng tiêu chí đồng đều cho mọi bài

**3. Phản hồi chi tiết**
- Chỉ ra cụ thể điểm mạnh/yếu
- Gợi ý cách cải thiện

### Nhược điểm

**1. Thiếu sự thấu hiểu ngữ cảnh**
- Khó đánh giá sự sáng tạo
- Có thể bỏ qua ý tưởng độc đáo

**2. Phụ thuộc vào training data**
- Nếu dữ liệu huấn luyện thiên lệch, kết quả cũng thiên lệch

**3. Chưa thể thay thế hoàn toàn**
- Một số bài cần sự đánh giá của con người

### Cách sử dụng AI chấm bài hiệu quả

1. **Dùng AI để chấm sơ bộ** - Tiết kiệm thời gian
2. **Giáo viên review các bài điểm biên** - Đảm bảo công bằng
3. **Kết hợp phản hồi AI và nhận xét cá nhân** - Học sinh được hỗ trợ tốt nhất

### Kết luận

AI chấm bài tự luận đang ngày càng chính xác, nhưng vẫn cần sự giám sát của giáo viên. Hãy xem AI là công cụ hỗ trợ, không phải sự thay thế.
    `,
    thumbnail: "/images/blog/ai-cham-bai.jpg",
    category: "AI trong giáo dục",
    tags: ["AI", "chấm bài", "tự luận", "đánh giá"],
    author: {
      name: "Nguyễn Văn An",
      avatar: "/images/avatars/author-1.jpg",
      role: "Chuyên gia Công nghệ Giáo dục",
    },
    publishedAt: "2025-12-20",
    readingTime: 6,
  },
];

export const categories = [
  "Tất cả",
  "AI trong giáo dục",
  "Kỹ năng giảng dạy",
  "Hướng dẫn",
  "Xu hướng",
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "Tất cả") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
}

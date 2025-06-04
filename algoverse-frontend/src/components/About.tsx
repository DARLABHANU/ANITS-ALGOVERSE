import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import meghanaImage from "@/components/assets/meghana.jpg";
import HODImage from "@/components/assets/HOD.jpg";
import bhuvanaImage from "@/components/assets/bhuvana.jpg";
import BhanuImage from "@/components/assets/155470619.jfif";
import kalyanImage from "@/components/assets/kalyan.png";
import akkhashImage from "@/components/assets/akkhash.jpg";
import WhatsAppImage from "@/components/assets/WhatsApp Image 2025-05-29 at 3.41.30 PM.jpeg";
import januImage from "@/components/assets/janu.jpg";
import pavanImage from "@/components/assets/pavan.jpg";
import varunImage from "@/components/assets/varun.jpg";
import { 
  ArrowLeft,
  GraduationCap,
  Users,
  Star,
  Github,
  Linkedin,
  Mail,
  Award,
  BookOpen,
  Code,
  Palette,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';

const About = () => {
  const faculty = [
    {
      name: "Dr Selvani Deepthi Kavila",
      designation: "Head of Department, Professor",
      department: "Computer Science & Engineering",
      image:HODImage,
      experience: "15+ years",
      specialization: "Algorithms & Data Structures"
    },
    {
      name: "Prof.M.V.Bhuvaneswari",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      image:bhuvanaImage,
      experience: "8+ years",
      specialization: "Software Engineering & Web Development"
    }
  ];

  const students = [
    {
      name: "Bhanu Murthy",
      role: "Full Stack Developer",
      image: BhanuImage,
      github: "https://github.com/DARLABHANU",
      linkedin: "https://in.linkedin.com/in/darla-bhanumurthy",
      email: "darlabhanumurthy.le23.csm@anits.edu.in",
      skills: ["React", "Node.js", "MongoDB"],
      icon: <Code className="w-5 h-5" />
    },
    {
      name: "Akkhash",
      role: "Frontend Developer",
      image: akkhashImage,
      github: "https://github.com/akkhash2",
      linkedin: "https://www.linkedin.com/in/akkhash-pilla-6b68a2275",
      email: "pillaakkhash205@gmail.com",
      skills: ["HTML", "CSS", "JavaScript"],
      icon: <Palette className="w-5 h-5" />
    },
    {
      name: "Kalyan",
      role: "Backend Developer",
      image: kalyanImage,
      github: "https://github.com/vikramsingh",
      linkedin: "https://www.linkedin.com/in/kalyan-janu-335307310",
      email: "",
      skills: ["Python", "Django", "PostgreSQL"],
      icon: <Database className="w-5 h-5" />
    },
    {
      name: "Pavan Rishi",
      role: "Frontend Developer",
      image: pavanImage,
      github: "",
      linkedin: "https://www.linkedin.com/in/pavan-rishi-dimili-a1770430a",
      email: "dimilipavanrishi.le23.csm@anits.edu.in",
      skills: ["HTML", "CSS", "JavaScript"],
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: "Jahnavi",
      role: "AI & Prompt Engineer",
      image: januImage,
      github: "",
      linkedin: "https://www.linkedin.com/in/jahnavibudi",
      email: "budijahnavi.le23.csm@anits.edu.in",
      skills: ["Python", "Node.js", "Figma"],
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      name: "Bhargav",
      role: "UI & UX Designer",
      image: WhatsAppImage,
      github: "",
      linkedin: "https://www.linkedin.com/in/bhargav-vasupilli-980b59320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "vasupillibhargav.le23.csm@anits.edu.in",
      skills: ["Html", "Css", "React"],
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: "Meghana",
      role: "Animator",
      image: meghanaImage,
      github: "",
      linkedin: "https://in.linkedin.com/in/meghana-surisetti-622586342?trk=public_profile_samename-profile",
      email: "surisettimeghana.le23.cse@anits.edu.in",
      skills: ["React", "TYpeScript", "Tailwind"],
      icon: <Award className="w-5 h-5" />
    },
    {
      name: "Varun",
      role: "Animator",
      image: varunImage,
      github: "https://github.com/BotchaVarun",
      linkedin: "https://in.linkedin.com/in/varun-botcha-b35937275",
      email: "varunbotcha77@gmail.com",
      skills: ["React", "TYpeScript", "Tailwind"],
      icon: <Star className="w-5 h-5" />
    },
    {
      name: "Meera Reddy",
      role: "Quality Assurance Engineer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      github: "https://github.com/meerareddy",
      linkedin: "https://linkedin.com/in/meerareddy",
      email: "meera.reddy@student.anits.edu.in",
      skills: ["Selenium", "Jest", "Cypress"],
      icon: <Star className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Watermark */}
      <div className="watermark">AlgoVerse</div>
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
            <span className="text-xl font-bold gradient-text">AlgoVerse</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">AlgoVerse</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A project developed by passionate students at Anil Neerukonds Institute of Technology and Sciences, 
              dedicated to making algorithms and data structures accessible to everyone.
            </p>
            
            {/* College Info */}
            <Card className="algo-card max-w-4xl mx-auto mb-16">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="feature-icon">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">ANITS</h2>
                    <p className="text-lg text-muted-foreground">Anil Neerukonds Institute of Technology and Sciences</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Established with a vision to provide quality technical education, ANITS has been nurturing 
                  innovative minds and fostering technological advancement. Our Computer Science department 
                  encourages students to build practical projects that solve real-world problems.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Faculty Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="section-title gradient-text">Our Faculty Mentors</h2>
              <p className="text-lg text-muted-foreground">
                Guided by experienced educators who inspire innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faculty.map((member, index) => (
                <Card key={index} className="algo-card">
                  <CardContent className="p-8 text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-2">{member.designation}</p>
                    <p className="text-muted-foreground mb-4">{member.department}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{member.experience} Experience</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4 text-secondary" />
                        <span>{member.specialization}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Students Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="section-title gradient-text">Our Development Team</h2>
              <p className="text-lg text-muted-foreground">
                Meet the talented students who brought AlgoVerse to life
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {students.map((student, index) => (
                <Card key={index} className="algo-card group hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary/20">
                      <AvatarImage src={student.image} alt={student.name} />
                      <AvatarFallback className="bg-primary/10">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-lg font-bold mb-1">{student.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {student.icon}
                      <p className="text-primary font-medium text-sm">{student.role}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {student.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <a 
                        href={student.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a 
                        href={student.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </a>
                      <a 
                        href={`mailto:${student.email}`}
                        className="p-2 rounded-full bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <div className="mt-20 text-center">
            <Card className="algo-card max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  AlgoVerse was born from our collective passion to make computer science concepts more 
                  accessible and engaging. We believe that learning algorithms and data structures should 
                  be an interactive, visual, and enjoyable experience.
                </p>
                <p className="text-muted-foreground">
                  Through this platform, we aim to bridge the gap between theoretical knowledge and 
                  practical application, helping students worldwide excel in their computer science journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

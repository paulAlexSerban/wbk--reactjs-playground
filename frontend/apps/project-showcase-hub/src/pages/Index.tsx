import { useState } from 'react';
import { Header } from '@/components/portfolio/Header';
import { SearchBar } from '@/components/portfolio/SearchBar';
import { ViewToggle } from '@/components/portfolio/ViewToggle';
import { FilterControls } from '@/components/portfolio/FilterControls';
import { FeaturedSection } from '@/components/portfolio/FeaturedSection';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { Pagination } from '@/components/portfolio/Pagination';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';

const Index = () => {
    const {
        projects,
        filters,
        updateFilter,
        resetFilters,
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        totalPages,
        totalResults,
    } = useProjects();

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const showFeatured = !filters.search && filters.categories.length === 0 && filters.techStack.length === 0;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                {/* Featured Section */}
                {showFeatured && <FeaturedSection onProjectClick={handleProjectClick} />}

                {/* Controls */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <SearchBar value={filters.search} onChange={(value) => updateFilter('search', value)} />
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    </div>
                    <FilterControls
                        filters={filters}
                        updateFilter={updateFilter}
                        resetFilters={resetFilters}
                        totalResults={totalResults}
                    />
                </div>

                {/* Project Grid */}
                <ProjectGrid projects={projects} viewMode={viewMode} onProjectClick={handleProjectClick} />

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </main>

            {/* Project Modal */}
            <ProjectModal project={selectedProject} open={modalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Index;

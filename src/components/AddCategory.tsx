import { type Category } from '@prisma/client';
import { CheckCircle, Plus } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input, InputError, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/utils/api';

type Inputs = Pick<Category, 'name' | 'parentCategoryId'>;

const AddCategory = ({
  categories,
  refetchCategories,
}: {
  categories: Array<Pick<Category, 'name' | 'id'>>;
  refetchCategories: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const addCategoryMutation = api.categories.create.useMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (
      categories.find(
        (category) =>
          category.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      )
    ) {
      setError('name', {
        type: 'manual',
        message: 'This category already exists',
      });
    }
    addCategoryMutation
      .mutateAsync(data)
      .then(() => {
        refetchCategories();
      })
      .catch(console.error);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new category</DialogTitle>
        </DialogHeader>
        {addCategoryMutation.isSuccess ? (
          <>
            <div className="mx-auto flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Category added
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <InputGroup className="justify-items-start">
              <Label>Name</Label>
              <Input
                placeholder="Name"
                {...register('name', {
                  required: 'This field is required',
                  pattern: {
                    value: /^[a-zA-Z0-9 ]+$/,
                    message: 'Only alphanumeric characters',
                  },
                })}
              />
              {errors.name && <InputError>{errors.name.message}</InputError>}
            </InputGroup>
            <InputGroup className="justify-items-start">
              <Label>Parent Category</Label>
              <Controller
                control={control}
                name="parentCategoryId"
                render={({ field }) => (
                  <>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <>
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          </>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
              {errors.parentCategoryId && (
                <InputError>{errors.parentCategoryId.message}</InputError>
              )}
            </InputGroup>
          </div>
        )}
        <DialogFooter>
          {addCategoryMutation.isSuccess ? (
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={() => {
                  addCategoryMutation.reset();
                  reset();
                }}
                variant="outline"
                className="mx-auto mt-2"
              >
                Close
              </Button>
            </DialogTrigger>
          ) : addCategoryMutation.isError ? (
            <Button
              type="button"
              onClick={() => {
                addCategoryMutation.reset();
              }}
              variant="destructive"
              className="mx-auto mt-2"
            >
              Reset
            </Button>
          ) : (
            <Button
              type="button"
              className="ml-auto"
              disabled={addCategoryMutation.isLoading}
              onClick={() => handleSubmit(onSubmit)()}
            >
              Add category
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
